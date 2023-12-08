import { NextFunction, Response } from "express";
import seniorSupervisorService from "../../services/seniorSupervisorServices/seniorSupervisor.service";
import seniorSupervisorModel from "../../models/seniorSupervisors.model";
import areaModel from "../../models/area.model";
import productModel from "../../models/product.model";
import bankModel from "../../models/bank.model";
import caseModel from "@/models/case.model";
import mongoose from "mongoose";
import allocationSearch from "@/helpers/customSearch/allocations";
import userAllocationModel from "@/models/userAllocations.model";



class seniorSupervisorController {
    public seniorSupervisorService = new seniorSupervisorService();

    public addSeniorSupervisor = async (req: any, res: Response, next: NextFunction) => {
        try {
            let role = req.user.role
            let email = req.user.email
            let area = await areaModel.find();
            let product = await productModel.find();
            let bank = await bankModel.find();
            res.locals.message = req.flash();
            res.render("seniorSupervisor/addSeniorSupervisor", { role, email, area, product, bank })
        } catch (error) { next(error) }

    }
    public addSeniorSupervisorData = async (req: any, res: Response, next: NextFunction) => {
        try {
            const addSeniorSupervisorDataConfirmation: any = await this.seniorSupervisorService.addSeniorSupervisorData(req);
            if (addSeniorSupervisorDataConfirmation.code == 201) {
                req.flash("success", addSeniorSupervisorDataConfirmation.message)
                res.redirect("/senior-supervisor/viewSeniorSupervisor")
            } else {
                req.flash("error", addSeniorSupervisorDataConfirmation.message)
                res.redirect("/senior-supervisor/addSeniorSupervisor")
            }

        } catch (error) { next(error) }

    }
    public viewSeniorSupervisor = async (req: any, res: Response, next: NextFunction) => {
        try {
            let role: any = req.user.role
            let email = req.user.email
            res.locals.message = req.flash();
            res.render("seniorSupervisor/viewSeniorSupervisor", { role, email, })
        } catch (error) { next(error) }


    }
    public viewSeniorSupervisorDatatable = async (req: any, res: Response, next: NextFunction) => {
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
            seniorSupervisorModel.countDocuments(condition).exec((err, row) => {
                if (err) next(err);
                let data: any = [];
                let count: any = 1;
                seniorSupervisorModel.aggregate(condition).exec((err, rows) => {
                    if (err) next(err);
                    rows.forEach((doc: any) => {
                        data.push({
                            count: count,
                            name: doc.fullName,
                            email: doc.email,
                            allocation: `<a href="/senior-supervisor/allocations?id=${doc._id}&name=${doc.fullName}" class="btn btn-info btn-rounded">Allocations Info</a>`,
                            action: `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/senior-supervisor/editSeniorSupervisor/${doc._id}" data-original-title="Edit">
                                        <i class="fas fa-pencil"></i>
                                        </a>
                                        <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert('/senior-supervisor/deleteSeniorSupervisor/${doc._id}', 'Are you sure you want to delete this data?')" data-original-title="Delete">
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
    };

    public editSeniorSupervisor = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let role = req.user.role;
                let email = req.user.email
                let id = req.params.id
                let seniorSupervisorData: any = await seniorSupervisorModel.findOne({ _id: id })
                let area = await areaModel.find();
                let product = await productModel.find();
                let bank = await bankModel.find();
                res.locals.message = req.flash();
                res.render("seniorSupervisor/editSeniorSupervisor", { role, email, id, area, product, bank, seniorSupervisorData })
            } else {
                req.flash("error", "ACCESS DENIED")
                res.redirect("/senior-supervisor/viewSeniorSupervisor")
            }
        } catch (error) { next(error) }


    }
    public editSeniorSupervisorData = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const editSeniorSupervisorConfirmation: any = await this.seniorSupervisorService.editSeniorSupervisorData(req);
                if (editSeniorSupervisorConfirmation.code == 201) {
                    req.flash("success", editSeniorSupervisorConfirmation.message)
                    res.redirect(`${req.body.myUrl}`)
                } else {
                    req.flash("error", editSeniorSupervisorConfirmation.message)
                    res.redirect(`${req.body.myUrl}`)
                }
            } else {
                req.flash("error", "ACCESS DENIED")
                res.redirect("/senior-supervisor/viewSeniorSupervisor")
            }

        } catch (error) { next(error) }

    }
    public deleteSeniorSupervisor = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const deleteSeniorSupervisorDataConfirmation: any = await this.seniorSupervisorService.deleteSeniorSupervisorData(req);
                if (deleteSeniorSupervisorDataConfirmation.code == 201) {
                    req.flash("success", deleteSeniorSupervisorDataConfirmation.message)
                } else {
                    req.flash("error", deleteSeniorSupervisorDataConfirmation.message)
                }

            } else {
                req.flash("error", "ACCESS DENIED")

            }
            res.redirect("/senior-supervisor/viewSeniorSupervisor")

        } catch (error) { next(error) }

    };

    // ************** manager allocations*******************************************
    public allocations = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin" || req.user.role == "manager") {
                const { role, email } = req.user;
                const { id, name } = req.query;
                res.locals.message = req.flash();
                res.render("seniorSupervisor/allocations", { role, email, id, name })
            } else {
                req.flash("error", "ACCESS DENIED")
                res.redirect("/senior-supervisor/viewSeniorSupervisor")
            }
        } catch (error) { next(error) }
    };

    public viewSeniorSupervisorAllocationDatatable = async (req: any, res: Response, next: NextFunction) => {
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
                                    <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/senior-supervisor/deleteSeniorSupervisorAllocation?seniorSupervisorId=${encodeURIComponent(req.body.id)}&allocId=${encodeURIComponent(allocations.data[i]._id)}&area=${encodeURIComponent(allocations.data[i].area)}&product=${encodeURIComponent(allocations.data[i].product)}&bank=${encodeURIComponent(allocations.data[i].bank)}&name=${encodeURIComponent(req.body.name)}" data-original-title="Delete">
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

    public deleteSeniorSupervisorAllocation = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role === "admin") {
                let checkInCase: any = await caseModel.findOne({ seniorSupervisorId: new mongoose.Types.ObjectId(req.query.seniorSupervisorId), area: req.query.area, product: req.query.product, bank: req.query.bank, status: "open" })

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


            res.redirect(`/senior-supervisor/allocations?id=${req.query.seniorSupervisorId}&name=${req.query.name}`)

        } catch (error) {
            next(error)
        }

    };

    public deleteMultipleSeniorSupervisorAllocation = async (req: any, res: Response, next: NextFunction) => {
        try {
            let status = ""
            for (let i = 0; i < req.body.checkAlloc.length; i++) {
                const checkInCase = await caseModel.findOne({ seniorSupervisorId: new mongoose.Types.ObjectId(req.body.seniorSupervisorId), area: req.body.checkAlloc[i].area, product: req.body.checkAlloc[i].product, bank: req.body.checkAlloc[i].bank, status: "open" })
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

    }




}

export default seniorSupervisorController;