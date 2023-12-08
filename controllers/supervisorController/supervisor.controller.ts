import { NextFunction, Request, Response } from "express";
import supervisorService from "../../services/supervisor/supervisor.service";
import supervisorModel from "../../models/supervisors.model";
import areaModel from "../../models/area.model";
import productModel from "../../models/product.model";
import bankModel from "../../models/bank.model";
import caseModel from "@/models/case.model";
import mongoose from "mongoose";
import userAllocationModel from "@/models/userAllocations.model";
import allocationSearch from "@/helpers/customSearch/allocations";




class supervisorController {
    public supervisorService = new supervisorService();

    public addSupervisor = async (req: any, res: Response, next: NextFunction) => {
        try {
            let role = req.user.role;
            let email = req.user.email;
            let area = await areaModel.find();
            let product = await productModel.find();
            let bank = await bankModel.find();
            res.locals.message = req.flash();
            res.render("supervisor/addSupervisor", { role, email, area, product, bank })
        } catch (error) { next(error) }

    }
    public addSupervisorData = async (req: any, res: Response, next: NextFunction) => {
        try {
            const addSupervisorDataConfirmation: any = await this.supervisorService.addSupervisorData(req);
            if (addSupervisorDataConfirmation.code == 201) {
                req.flash("success", addSupervisorDataConfirmation.message)
                res.redirect("/supervisor/viewSupervisor")
            } else {
                req.flash("error", addSupervisorDataConfirmation.message)
                res.redirect("/supervisor/addSupervisor")
            }

        } catch (error) { next(error) }

    }
    public viewSupervisor = async (req: any, res: Response, next: NextFunction) => {
        try {
            let role: any = req.user.role
            let email = req.user.email
            res.locals.message = req.flash()
            res.render("supervisor/viewSupervisor", { role, email, })
        } catch (error) { next(error) }

    }
    public viewSupervisorDatatable = async (req: any, res: Response, next: NextFunction) => {
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
            supervisorModel.countDocuments(condition).exec((err, row) => {
                if (err) next(err);
                let data: any = [];
                let count: any = 1;
                supervisorModel.aggregate(condition).exec((err, rows) => {
                    if (err) next(err);
                    rows.forEach((doc: any) => {
                        data.push({
                            count: count,
                            name: doc.fullName,
                            email: doc.email,
                            allocation: `<a href="/supervisor/allocations?id=${doc._id}&name=${doc.fullName}" class="btn btn-info btn-rounded">Allocations Info</a>`,
                            action: `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/supervisor/editSupervisor/${doc._id}" data-original-title="Edit">
                                        <i class="fas fa-pencil"></i>
                                        </a>
                                        <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert('/supervisor/deleteSupervisor/${doc._id}', 'Are you sure you want to delete this data?')" data-original-title="Delete">
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
    public editSupervisor = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let role = req.user.role;
                let email = req.user.email
                let id = req.params.id
                let supervisorData: any = await supervisorModel.findOne({ _id: req.params.id })
                let area = await areaModel.find();
                let product = await productModel.find();
                let bank = await bankModel.find();
                res.locals.message = req.flash();
                res.render("supervisor/editSupervisor", { role, email, id, area, product, bank, supervisorData })
            }
            else {
                req.flash("error", "Access Denied")
                res.redirect("/supervisor/viewSupervisor")
            }
        } catch (error) { next(error) }

    }
    public editSupervisorData = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const editSupervisorConfirmation: any = await this.supervisorService.editSupervisorData(req);
                if (editSupervisorConfirmation.code == 201) {
                    req.flash("success", editSupervisorConfirmation.message)
                    res.redirect(`${req.body.myUrl}`)
                } else {
                    req.flash("error", editSupervisorConfirmation.message)
                    res.redirect(`${req.body.myUrl}`)
                }
            }
            else {
                req.flash("error", "Access Denied")
                res.redirect("/supervisor/viewSupervisor")
            }

        } catch (error) { next(error) }

    }
    public deleteSupervisor = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const deleteSupervisorDataConfirmation: any = await this.supervisorService.deleteSupervisorData(req);
                if (deleteSupervisorDataConfirmation.code == 201) {
                    req.flash("success", deleteSupervisorDataConfirmation.message)
                } else {
                    req.flash("error", deleteSupervisorDataConfirmation.message)
                }

            } else {
                req.flash("error", "Access Denied")
            }
            res.redirect("/supervisor/viewSupervisor")
        } catch (error) { next(error) }

    }
    // ************** supervisor allocations*******************************************
    public allocations = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin" || req.user.role == "manager" || req.user.role == "senior-supervisor") {
                const { role, email } = req.user;
                const { id, name } = req.query;
                res.locals.message = req.flash();
                res.render("supervisor/allocations", { role, email, id, name })
            } else {
                req.flash("error", "ACCESS DENIED")
                res.redirect("/supervisor/viewSupervisor")
            }
        } catch (error) { next(error) }
    };

    public viewSupervisorAllocationDatatable = async (req: any, res: Response, next: NextFunction) => {
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
                                <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/supervisor/deleteSupervisorAllocation?supervisorId=${encodeURIComponent(req.body.id)}&allocId=${encodeURIComponent(allocations.data[i]._id)}&area=${encodeURIComponent(allocations.data[i].area)}&product=${encodeURIComponent(allocations.data[i].product)}&bank=${encodeURIComponent(allocations.data[i].bank)}&name=${encodeURIComponent(req.body.name)}" data-original-title="Delete">
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

    public deleteSupervisorAllocation = async (req: any, res: Response, next: NextFunction) => {
        try {

            if (req.user.role === "admin") {
                let checkInCase: any = await caseModel.findOne({ supervisorId: new mongoose.Types.ObjectId(req.query.supervisorId), area: req.query.area, product: req.query.product, bank: req.query.bank, status: "open" })

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

            res.redirect(`/supervisor/allocations?id=${req.query.supervisorId}&name=${req.query.name}`)

        } catch (error) {
            next(error)
        }

    };

    public deleteMultipleSupervisorAllocation = async (req: any, res: Response, next: NextFunction) => {
        try {
            let status = ""
            for (let i = 0; i < req.body.checkAlloc.length; i++) {
                const checkInCase = await caseModel.findOne({ supervisorId: new mongoose.Types.ObjectId(req.body.supervisorId), area: req.body.checkAlloc[i].area, product: req.body.checkAlloc[i].product, bank: req.body.checkAlloc[i].bank, status: "open" })
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

export default supervisorController;