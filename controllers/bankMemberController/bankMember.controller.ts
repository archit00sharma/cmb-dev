import { NextFunction, Request, Response } from "express";
import bankMemberService from "../../services/bankMemberServices/bankMember.service";
import bankMemberModel from "../../models/bankMember.model";
import areaModel from "../../models/area.model";
import productModel from "../../models/product.model";
import bankModel from "../../models/bank.model";
import caseModel from "@/models/case.model";
import mongoose from "mongoose";
import userAllocationModel from "@/models/userAllocations.model";
import allocationSearch from "@/helpers/customSearch/allocations";
import bankMemberAllocationModel from "@/models/bankMemberAllocations.model";
import bankAllocationSearch from "@/helpers/customSearch/bankAllocation";



class bankMemberController {
    public bankMemberService = new bankMemberService();

    public addBankMember = async (req: any, res: Response, next: NextFunction) => {
        try {
            let role = req.user.role;
            let email = req.user.email;
            let area = await areaModel.find();
            let product = await productModel.find();
            let bank = await bankModel.find();
            res.locals.message = req.flash();
            res.render("bankMember/addBankMember", { role, email, area, product, bank })
        } catch (error) { next(error) }

    }
    public addBankMemberData = async (req: any, res: Response, next: NextFunction) => {
        try {
            const addBankMemberDataConfirmation: any = await this.bankMemberService.addBankMemberData(req);
            if (addBankMemberDataConfirmation.code == 201) {
                req.flash("success", addBankMemberDataConfirmation.message)
                res.redirect("/bankMember/viewBankMember")
            } else {
                req.flash("error", addBankMemberDataConfirmation.message)
                res.redirect("/bankMember/addBankMember")
            }
        } catch (error) { next(error) }
    }
    public viewBankMember = async (req: any, res: Response, next: NextFunction) => {
        try {
            let role: any = req.user.role
            let email = req.user.email
            res.locals.message = req.flash();
            res.render("bankMember/viewBankMember", { role, email })
        } catch (error) { next(error) }
    }
    public editBankMember = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let role = req.user.role;
                let email = req.user.email
                let id = req.params.id
                let bankMemberData: any = await bankMemberModel.findOne({ _id: req.params.id })
                let product = await productModel.find();
                let bank = await bankModel.find();
                res.locals.message = req.flash();
                res.render("bankMember/editBankMember", { role, email, id, product, bank, bankMemberData })
            } else {
                req.flash("error", "ACCESS DENIED")
                res.redirect("/bankMember/viewBankMember")
            }
        } catch (error) { next(error) }
    }
    public editBankMemberData = async (req: any, res: Response, next: NextFunction) => {
        try {
            let role = req.user.role;
            let email = req.user.email
            if (req.user.role == "admin") {
                const editBankMemberDataConfirmation: any = await this.bankMemberService.editBankMemberData(req);

                if (editBankMemberDataConfirmation.code == 201) {
                    req.flash("success", editBankMemberDataConfirmation.message)
                    res.redirect(`${req.body.myUrl}`)
                } else {
                    req.flash("error", editBankMemberDataConfirmation.message)
                    res.redirect(`${req.body.myUrl}`)
                }
            } else {
                req.flash("error", "ACCESS DENIED")
                res.redirect("/bankMember/viewBankMember")
            }

        } catch (error) { next(error) }

    }
    public viewBankMemberDatatable = async (req: any, res: Response, next: NextFunction) => {
        try {

            let condition: any = []
            condition.push(
                {
                    $match: {
                        isDeleted: {
                            $exists: false
                        }
                    },
                },
            )
            bankMemberModel.countDocuments(condition).exec((err, row) => {
                if (err) next(err);
                let data: any = [];
                let count: any = 1;
                bankMemberModel.aggregate(condition).exec((err, rows) => {
                    if (err) next(err);
                    rows.forEach((doc: any) => {
                        data.push({
                            count: count,
                            name: doc.fullName,
                            email: doc.email,
                            allocation: `<a href="/bankMember/allocations?id=${doc._id}&name=${doc.fullName}" class="btn btn-info btn-rounded">Allocations Info</a>`,
                            action: `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/bankMember/editBankMember/${doc._id}" data-original-title="Edit">
                                        <i class="fas fa-pencil"></i>
                                        </a>
                                        <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert(' /bankMember/deleteBankMember/${doc._id}', 'Are you sure you want to delete this data?')" data-original-title="Delete">
                                        <i class="far fa-trash-alt"></i> </a>
                                    </div>`
                        })
                        count++;
                        if (count > rows.length) {
                            let jsonData = JSON.stringify({ data });
                            res.send(jsonData);
                        }
                    })
                })
            })
        } catch (error) {
            next(error);
        }
    }
    public deleteBankMember = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const deleteBankMemberDataConfirmation: any = await this.bankMemberService.deleteBankMemberData(req);
                if (deleteBankMemberDataConfirmation.code == 201) {
                    req.flash("success", deleteBankMemberDataConfirmation.message)
                } else {
                    req.flash("error", deleteBankMemberDataConfirmation.message)
                }
            } else {
                req.flash("error", "ACCESS DENIED")
            }
            res.redirect("/bankMember/viewbankMember")
        } catch (error) { next(error) }

    }

    // ************** bankMember allocations*******************************************
    public allocations = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const { role, email } = req.user;
                const { id, name } = req.query;
                res.locals.message = req.flash();
                res.render("bankMember/allocations", { role, email, id, name })
            } else {
                req.flash("error", "ACCESS DENIED")
                res.redirect("/bankMember/viewBankMember")
            }
        } catch (error) { next(error) }
    };

    public viewBankMemberAllocationDatatable = async (req: any, res: Response, next: NextFunction) => {
        try {

            let condition = [];
            let array1 = [];
            let array2 = [];
            let array3 = [];

            let searchArray = await bankAllocationSearch(req.body.columns);
            array3.push({
                $match: {
                    $and: [
                        {
                            user_id: new mongoose.Types.ObjectId(req.body.id),
                        },
                    ],
                },
            });
            array1.push({
                $match: {
                    $and: [
                        {
                            user_id: new mongoose.Types.ObjectId(req.body.id),
                        },
                    ],
                },
            });
            array2.push({
                $match: {
                    $and: [
                        {
                            user_id: new mongoose.Types.ObjectId(req.body.id),
                        },
                    ],
                },
            });
            array3.push({
                $count: "sum",
            });

            if (searchArray.length > 0) {
                array1.push({
                    $match: {
                        $and: searchArray,
                    },
                });
                array2.push({
                    $match: {
                        $and: searchArray,
                    },
                });
            }

            array1.push({
                $count: "sum",
            });
            array2.push(
                {
                    $skip: parseInt(req.body.start),
                },
                {
                    $limit: parseInt(req.body.length),
                }
            );
            condition.push(
                {
                    $facet: {
                        sum1: array3,
                        sum2: array1,
                        data: array2,
                    },
                },
                {
                    $unwind: {
                        path: "$sum1",
                    },
                },
                {
                    $unwind: {
                        path: "$sum2",
                    },
                }
            );
            let data: any = [];
            const [allocations] = await bankMemberAllocationModel.aggregate(condition);
            let count = parseInt(req.body.start) + 1;
            if (allocations) {
                for (let i = 0; i < allocations.data.length; i++) {
                    data.push({
                        count: count,
                        product: allocations.data[i].product,
                        bank: allocations.data[i].bank,
                        allocId: allocations.data[i]._id,
                        action: `<div> 
                                    <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/bankMember/deleteBankMemberAllocation?bankMemberId=${encodeURIComponent(req.body.id)}&allocId=${encodeURIComponent(allocations.data[i]._id)}&product=${encodeURIComponent(allocations.data[i].product)}&bank=${encodeURIComponent(allocations.data[i].bank)}&name=${encodeURIComponent(req.body.name)}" data-original-title="Delete">
                                        <i class="far fa-trash-alt"></i> 
                                    </a>    
                                </div>`,
                    });
                    count++;
                }
                if (data.length == allocations.data.length) {
                    let jsonData = JSON.stringify({
                        draw: parseInt(req.body.draw),
                        recordsTotal: allocations.sum1.sum,
                        recordsFiltered: allocations.sum2.sum,
                        data,
                    });
                    res.send(jsonData);
                }
            } else {
                let jsonData = JSON.stringify({
                    draw: parseInt(req.body.draw),
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data,
                });
                res.send(jsonData);
            }

        } catch (error) {
            next(error);
        }
    };

    public deleteBankMemberAllocation = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role === "admin") {
                const deleteAllocation = await bankMemberAllocationModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.query.allocId) })

                if (deleteAllocation) {
                    req.flash("success", 'Allocation deleted Successfully')
                } else {
                    req.flash("error", 'Some Internal server error')
                }
            } else {
                req.flash("error", 'Access Denied')
            }
            res.redirect(`/bankMember/allocations?id=${req.query.bankMemberId}&name=${req.query.name}`)

        } catch (error) {
            next(error)
        }

    };

    public deleteMultipleBankMemberAllocation = async (req: any, res: Response, next: NextFunction) => {
        try {

            for (let i = 0; i < req.body.checkAlloc.length; i++) {
                await bankMemberAllocationModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.body.checkAlloc[i].id) })
            }
            res.send('success')
        } catch (error) {
            res.send('failed')
            next()
        }

    }
    



}

export default bankMemberController;