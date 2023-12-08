import { NextFunction, Request, Response } from "express";
import managerService from "../../services/managerServices/manager.service";
import managerModel from "../../models/manager.model";
import areaModel from "../../models/area.model";
import productModel from "../../models/product.model";
import bankModel from "../../models/bank.model";
import caseModel from "@/models/case.model";
import mongoose from "mongoose";
import userAllocationModel from "@/models/userAllocations.model";
import allocationSearch from "@/helpers/customSearch/allocations";




class managerController {
    public managerService = new managerService();

    public addManager = async (req: any, res: Response, next: NextFunction) => {
        try {
            let role = req.user.role;
            let email = req.user.email;
            let area = await areaModel.find();
            let product = await productModel.find();
            let bank = await bankModel.find();
            res.locals.message = req.flash();
            res.render("manager/addManager", { role, email, area, product, bank })
        } catch (error) { next(error) }

    };

    public addManagerData = async (req: any, res: Response, next: NextFunction) => {
        try {
            const addManagerDataConfirmation: any = await this.managerService.addManagerData(req);
            if (addManagerDataConfirmation.code == 201) {
                req.flash("success", addManagerDataConfirmation.message)
                res.redirect("/manager/viewManager")
            } else {
                req.flash("error", addManagerDataConfirmation.message)
                res.redirect("/manager/addManager")
            }

        } catch (error) { next(error) }

    };

    public viewManager = async (req: any, res: Response, next: NextFunction) => {
        try {
            let role: any = req.user.role
            let email = req.user.email
            res.locals.message = req.flash();
            res.render("manager/viewManager", { role, email })
        } catch (error) { next(error) }


    };

    public editManager = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let role = req.user.role;
                let email = req.user.email
                let id = req.params.id
                let managerData: any = await managerModel.findOne({ _id: req.params.id })
                let area = await areaModel.find();
                let product = await productModel.find();
                let bank = await bankModel.find();
                res.locals.message = req.flash();
                res.render("manager/editManager", { role, email, id, area, product, bank, managerData })
            } else {
                req.flash("error", "ACCESS DENIED")
                res.redirect("/manager/viewManager")
            }
        } catch (error) { next(error) }
    };

    public editManagerData = async (req: any, res: Response, next: NextFunction) => {
        try {
            let role = req.user.role;
            let email = req.user.email
            if (req.user.role == "admin") {
                const editManagerDataConfirmation: any = await this.managerService.editManagerData(req);

                if (editManagerDataConfirmation.code == 201) {
                    req.flash("success", editManagerDataConfirmation.message)
                    res.redirect(`${req.body.myUrl}`)
                } else {
                    req.flash("error", editManagerDataConfirmation.message)
                    res.redirect(`${req.body.myUrl}`)
                }
            } else {
                req.flash("error", "ACCESS DENIED")
                res.redirect("/manager/viewManager")
            }

        } catch (error) { next(error) }

    };

    public viewManagerDatatable = async (req: any, res: Response, next: NextFunction) => {
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
            managerModel.countDocuments(condition).exec((err, row) => {
                if (err) next(err);
                let data: any = [];
                let count: any = 1;
                managerModel.aggregate(condition).exec((err, rows) => {
                    if (err) next(err);
                    rows.forEach((doc: any) => {
                        data.push({
                            count: count,
                            name: doc.fullName,
                            email: doc.email,
                            allocation: `<a href="/manager/allocations?id=${doc._id}&name=${doc.fullName}" class="btn btn-info btn-rounded">Allocations Info</a>`,
                            action: `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/manager/editManager/${doc._id}" data-original-title="Edit">
                                        <i class="fas fa-pencil"></i>
                                        </a>
                                        <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert(' /manager/deleteManager/${doc._id}', 'Are you sure you want to delete this data?')" data-original-title="Delete">
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

    public deleteManager = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const deleteManagerDataConfirmation: any = await this.managerService.deleteManagerData(req);
                if (deleteManagerDataConfirmation.code == 201) {
                    req.flash("success", deleteManagerDataConfirmation.message)
                } else {
                    req.flash("error", deleteManagerDataConfirmation.message)
                }
            } else {
                req.flash("error", "ACCESS DENIED")
            }
            res.redirect("/manager/viewManager")
        } catch (error) { next(error) }

    };

    // ************** manager allocations*******************************************
    public allocations = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const { role, email } = req.user;
                const { id, name } = req.query;
                res.locals.message = req.flash();
                res.render("manager/allocations", { role, email, id, name })
            } else {
                req.flash("error", "ACCESS DENIED")
                res.redirect("/manager/viewManager")
            }
        } catch (error) { next(error) }
    };

    public viewManagerAllocationDatatable = async (req: any, res: Response, next: NextFunction) => {
        try {

            let condition = [];
            let array1 = [];
            let array2 = [];
            let array3 = [];

            let searchArray = await allocationSearch(req.body.columns);
            array3.push({
                $match: {
                    $and: [
                        {
                            user_id: new mongoose.Types.ObjectId(req.body.id),
                        },
                        {
                            role: req.body.role,
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
                        {
                            role: req.body.role,
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
                        {
                            role: req.body.role,
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
            const [allocations] = await userAllocationModel.aggregate(condition);
            let count = parseInt(req.body.start) + 1;
            if (allocations) {
                for (let i = 0; i < allocations.data.length; i++) {
                    data.push({
                        count: count,
                        area: allocations.data[i].area,
                        product: allocations.data[i].product,
                        bank: allocations.data[i].bank,
                        allocId: allocations.data[i]._id,
                        action: `<div> 
                                    <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/manager/deleteManagerAllocation?managerId=${encodeURIComponent(req.body.id)}&allocId=${encodeURIComponent(allocations.data[i]._id)}&area=${encodeURIComponent(allocations.data[i].area)}&product=${encodeURIComponent(allocations.data[i].product)}&bank=${encodeURIComponent(allocations.data[i].bank)}&name=${encodeURIComponent(req.body.name)}" data-original-title="Delete">
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

    public deleteManagerAllocation = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role === "admin") {
                let checkInCase: any = await caseModel.findOne({ managerId: new mongoose.Types.ObjectId(req.query.managerId), area: req.query.area, product: req.query.product, bank: req.query.bank, status: "open" })

                if (checkInCase) {
                    req.flash("error", 'Allocation cannot be deleted as it is already in use!!!')
                } else {
                    const deleteAllocation = await userAllocationModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.query.allocId) })

                    if (deleteAllocation) {
                        req.flash("success", 'Allocation deleted Successfully')
                    } else {
                        req.flash("error", 'Some Internal server error')
                    }

                }
            } else {
                req.flash("error", 'Access Denied')
            }

            res.redirect(`/manager/allocations?id=${req.query.managerId}&name=${req.query.name}`)

        } catch (error) {
            next(error)
        }

    };

    public deleteMultipleManagerAllocation = async (req: any, res: Response, next: NextFunction) => {
        try {
            let status = ""
            for (let i = 0; i < req.body.checkAlloc.length; i++) {
                const checkInCase = await caseModel.findOne({ managerId: new mongoose.Types.ObjectId(req.body.managerId), area: req.body.checkAlloc[i].area, product: req.body.checkAlloc[i].product, bank: req.body.checkAlloc[i].bank, status: "open" })
                if (checkInCase) {
                    status = "failed";
                    break;
                } else {
                    await userAllocationModel.deleteOne({ _id: new mongoose.Types.ObjectId(req.body.checkAlloc[i].id) })
                }
            }
            if (status !== 'failed') {
                res.send("success")
            } else {
                res.send("failed")
            }
        } catch (error) {
            next(error)
        }

    };
}

export default managerController;