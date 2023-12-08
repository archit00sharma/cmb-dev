
import { NextFunction, Request, Response } from "express";
import adminService from "../../services/adminServices/admin.service";
import productModel from "../../models/product.model";
import bankModel from "../../models/bank.model";
import areaModel from "../../models/area.model";
import tatFileModel from "@/models/tatFiles.model";
import mongoose from "mongoose";
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import tatFilesSearch from '../../helpers/customSearch/tatFileSearch'
import fieldExecutiveModel from '@/models/fieldExecutive.model';
import feCaseHistorySearch from '@/helpers/customSearch/feCaseHistorySearch';
import feSubmittedCasesModel from '@/models/fieldExecutiveSubmittedCases.model';

class adminController {
    public adminService = new adminService();
    public profile = async (req: any, res: Response, next: NextFunction) => {
        try {

            let role = req.user.role
            let email = req.user.email
            const addAdminProfileDataConfirmation: any = await this.adminService.addAdminProfileDataDisplay(req)
            if (addAdminProfileDataConfirmation.email) {
                res.locals.message = req.flash()
                res.render("admin/adminProfile", { role, email, addAdminProfileDataConfirmation })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }

        } catch (error) {
            next(error)
        }

    }
    public profileData = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const addAdminProfileDataConfirmation: any = await this.adminService.addAdminProfileData(req);
                if (addAdminProfileDataConfirmation.code == 201) {
                    req.flash("success", addAdminProfileDataConfirmation.message)
                } else {
                    req.flash("error", addAdminProfileDataConfirmation.message)
                }
            } else {
                req.flash("error", "Access Denied")
            }
            res.redirect("/dashboard")
        } catch (error) { next(error) }

    }
    public addProduct = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let role = req.user.role
                let email = req.user.email
                res.locals.message = req.flash()
                res.render("admin/addProduct", { role, email })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }

        } catch (error) { next(error) }

    }
    public addProductData = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const addProductDataConfirmation: any = await this.adminService.addProductData(req);
                if (addProductDataConfirmation.code == 201) {
                    req.flash("success", addProductDataConfirmation.message)
                } else {
                    req.flash("error", addProductDataConfirmation.message)
                }
                res.redirect("/admin/viewProduct")
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }

        } catch (error) { next(error) }

    }
    public viewProduct = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let role: any = req.user.role
                let email = req.user.email
                res.locals.message = req.flash()
                res.render("admin/viewProduct", { role, email, })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }

        } catch (error) { next(error) }

    }
    public editProduct = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let role = req.user.role;
                let email = req.user.email
                let id = req.params.id
                let productData = await productModel.findOne({ _id: id })

                res.locals.message = req.flash()
                res.render("admin/editProduct", { role, email, id, productData })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }
    }
    public editProductData = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const editManagerDataConfirmation: any = await this.adminService.editProductData(req);
                if (editManagerDataConfirmation.code == 201) {
                    req.flash("success", editManagerDataConfirmation.message)
                } else {
                    req.flash("error", editManagerDataConfirmation.message)
                }
                res.redirect("/admin/viewProduct")
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }

    }
    public viewProductDatatable = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let condition: any = []
                productModel.countDocuments().exec((err, row) => {
                    if (err) next(err);
                    let data: any = [];
                    let count: any = 1;
                    productModel.find().exec((err, rows) => {
                        if (err) next(err);
                        rows.forEach((doc: any) => {
                            data.push({
                                count: count,
                                product: doc.product,
                                action: `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href="/admin/editProduct/${doc._id}" data-original-title="Edit">
                                    <i class="fas fa-pencil"></i>
                                </a>
                                <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert(' /admin/deleteProduct/${doc._id}', 'Are you sure you want to delete this data?')" data-original-title="Delete">
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
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) {
            next(error);
        }
    }
    public deleteProduct = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const deleteProductDataConfirmation: any = await this.adminService.deleteProductData(req);
                if (deleteProductDataConfirmation.code == 201) {
                    req.flash("success", deleteProductDataConfirmation.message)
                } else {
                    req.flash("error", deleteProductDataConfirmation.message)
                }
                res.redirect("/admin/viewProduct")
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }
    }


    public addBank = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let role = req.user.role
                let email = req.user.email
                res.locals.message = req.flash()
                res.render("admin/addBank", { role, email })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }

    }
    public addBankData = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const addBankDataConfirmation: any = await this.adminService.addBankData(req);
                if (addBankDataConfirmation.code == 201) {
                    req.flash("success", addBankDataConfirmation.message)
                } else {
                    req.flash("error", addBankDataConfirmation.message)
                }
                res.redirect("/admin/viewBank")
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }

        } catch (error) { next(error) }

    }
    public viewBank = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let role: any = req.user.role
                let email = req.user.email
                res.locals.message = req.flash()
                res.render("admin/viewBank", { role, email, })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }
    }
    public editBank = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let role = req.user.role;
                let email = req.user.email
                let id = req.params.id
                let bankData = await bankModel.findOne({ _id: id })
                res.locals.message = req.flash();
                res.render("admin/editBank", { role, email, id, bankData })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }
    }
    public editBankData = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const editBankDataConfirmation: any = await this.adminService.editBankData(req);
                if (editBankDataConfirmation.code == 201) {
                    req.flash("success", editBankDataConfirmation.message)
                } else {
                    req.flash("error", editBankDataConfirmation.message)
                }
                res.redirect("/admin/viewBank")
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }

    }
    public viewBankDatatable = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let condition: any = []
                bankModel.countDocuments().exec((err, row) => {
                    if (err) next(err);
                    let data: any = [];
                    let count: any = 1;
                    bankModel.find().exec((err, rows) => {
                        if (err) next(err);
                        rows.forEach((doc: any) => {
                            data.push({
                                count: count,
                                bank: doc.bank,
                                action: `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href="/admin/editBank/${doc._id}" data-original-title="Edit">
                                    <i class="fas fa-pencil"></i>
                                </a>
                                <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert(' /admin/deleteBank/${doc._id}', 'Are you sure you want to delete this data?')" data-original-title="Delete">
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
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) {
            next(error);
        }
    }
    public deleteBank = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const deleteBankDataConfirmation: any = await this.adminService.deleteBankData(req);
                if (deleteBankDataConfirmation.code == 201) {
                    req.flash("success", deleteBankDataConfirmation.message)
                } else {
                    req.flash("error", deleteBankDataConfirmation.message)
                }
                res.redirect("/admin/viewBank")
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }

    }


    public addArea = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let role = req.user.role
                let email = req.user.email
                res.locals.message = req.flash()
                res.render("admin/addArea", { role, email })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }

        } catch (error) { next(error) }
    }
    public addAreaData = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const addAreaDataConfirmation: any = await this.adminService.addAreaData(req);
                if (addAreaDataConfirmation.code == 201) {
                    req.flash("success", addAreaDataConfirmation.message)
                } else {
                    req.flash("error", addAreaDataConfirmation.message)
                }
                res.status(addAreaDataConfirmation.code).redirect("/admin/viewArea")
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }

        } catch (error) { next(error) }
    }
    public viewArea = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let role: any = req.user.role
                let email = req.user.email
                res.locals.message = req.flash()
                res.render("admin/viewArea", { role, email, })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }
    }
    public editArea = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                let role = req.user.role;
                let email = req.user.email
                let id = req.params.id
                let areaData = await areaModel.findOne({ _id: id })
                res.locals.message = req.flash()
                res.render("admin/editArea", { role, email, id, areaData })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }
    }
    public editAreaData = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const editAreaDataConfirmation: any = await this.adminService.editAreaData(req);
                if (editAreaDataConfirmation.code == 201) {
                    req.flash("success", editAreaDataConfirmation.message)
                } else {
                    req.flash("error", editAreaDataConfirmation.message)
                }
                res.redirect("/admin/viewArea")
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }

    }
    public viewAreaDatatable = async (req: any, res: Response, next: NextFunction) => {
        try {
            let condition: any = []
            areaModel.countDocuments().exec((err, row) => {
                if (err) next(err);
                let data: any = [];
                let count: any = 1;
                areaModel.find().exec((err, rows) => {
                    if (err) next(err);
                    rows.forEach((doc: any) => {
                        data.push({
                            count: count,
                            area: doc.area,
                            action: `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href="/admin/editArea/${doc._id}" data-original-title="Edit">
                                    <i class="fas fa-pencil"></i>
                                </a>
                                <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert(' /admin/deleteArea/${doc._id}', 'Are you sure you want to delete this data?')" data-original-title="Delete">
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
    public deleteArea = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const deleteAreaDataConfirmation: any = await this.adminService.deleteAreaData(req);
                if (deleteAreaDataConfirmation.code == 201) {
                    req.flash("success", deleteAreaDataConfirmation.message)
                } else {
                    req.flash("error", deleteAreaDataConfirmation.message)
                }
                res.redirect("/admin/viewArea")
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }
    };

    public checkPassword = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role === "admin") {
                const addAdminPasswordDataConfirmation: any = await this.adminService.checkPassword(req, res);
                res.send(addAdminPasswordDataConfirmation)
            } else {
                res.send({
                    code: 401,
                    message: "Access denied"
                })
            }
        } catch (error) {
            error.code = 401
            res.send(error)
        }
    }

    public viewTatFiles = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const { role, email } = req.user
                res.locals.message = req.flash()
                res.render("admin/tatFiles/viewTatFiles", { role, email, })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }
    }

    public viewTatFilesDatatable = async (req: any, res: Response, next: NextFunction) => {
        try {
            let condition = [];
            let array1 = [];
            let array2 = [];
            let array3 = [];


            let searchArray = await tatFilesSearch(req.body.columns);
            array3.push({
                $count: "sum",
            });

            if (req.body.columns[4].search.value.length > 0) {
                array1.push({
                    $addFields: {
                        "created_at_string": {
                            $toString: "$created_at",
                        },
                    },
                });
                array2.push({
                    $addFields: {
                        "created_at_string": {
                            $toString: "$created_at",
                        },
                    },
                });
            }

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
            const [tatFiles] = await tatFileModel.aggregate(condition);
            let count = parseInt(req.body.start) + 1;
            if (tatFiles) {
                for (let i = 0; i < tatFiles.data.length; i++) {
                    data.push({
                        count: count,
                        name: tatFiles.data[i]?.name || "NA",
                        status: tatFiles.data[i].status,
                        error: tatFiles.data[i].error || "NA",
                        date: moment(tatFiles.data[i].created_at).add({ hours: 5, minutes: 30 }).format('YYYY-MM-DD'),
                        time: moment(tatFiles.data[i].created_at).format('HH:mm:ss'),
                        action: `<div> 
                                    <a class="btn w-35px h-35px mr-1 btn-green text-uppercase btn-sm" data-toggle="tooltip" title="Download" 
                                    ${tatFiles.data[i].status === "success" ? `href=${process.env.BASE_URL}${tatFiles.data[i].fileUrl}` : 'disabled="disabled"'} data-original-title="Download">
                                    <i class="fa-solid fa-file-excel"></i>
                                    </a> 
                                    <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" 
                                    ${(tatFiles.data[i].status === "success" || tatFiles.data[i].error?.length > 0) ? `href="/admin/deleteTatFile/${tatFiles.data[i]._id}"` : 'disabled="disabled"'} data-original-title="Delete">
                                    <i class="far fa-trash-alt"></i> 
                                    </a>     
                                </div>`,
                    });
                    count++;
                }
                if (data.length == tatFiles.data.length) {
                    let jsonData = JSON.stringify({
                        draw: parseInt(req.body.draw),
                        recordsTotal: tatFiles.sum1.sum,
                        recordsFiltered: tatFiles.sum2.sum,
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
    }

    public deleteTatFile = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const { role, email } = req.user;
                const { id } = req.params;
                let deleteStatus = ""
                const file: any = await tatFileModel.findOne({ _id: id });

                fs.access(path.join(__dirname, '../../public', file.fileUrl), fs.constants.F_OK, async (err) => {
                    if (err) {
                        await tatFileModel.deleteOne({ _id: id });
                        deleteStatus = 'error';
                    } else {
                        fs.unlink(path.join(__dirname, '../../public', file.fileUrl), async (deleteErr) => {
                            if (deleteErr) {
                                deleteStatus = 'error';
                            } else {
                                await tatFileModel.deleteOne({ _id: id });
                                deleteStatus = 'success';
                            }
                        });
                    }
                });

                deleteStatus === 'error' ? req.flash('error', 'File deletion failed') : req.flash('success', 'File deleted successfully');
                res.redirect("/admin/viewTatFiles");
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }
    }


    public feCaseHistory = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const { role, email } = req.user
                res.locals.message = req.flash()
                const fieldExecutive = await fieldExecutiveModel.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).select('_id fullName');
                res.render("admin/feCaseHistory/feCaseHistory", { role, email, fieldExecutive })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }
    };

    public viewFeCaseHistory = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const { role, email } = req.user
                const { member, min, max, fullName } = req.body

                res.locals.message = req.flash();
                res.render("admin/feCaseHistory/feCaseHistoryDatatable", { role, email, member, min, max, fullName })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/dashboard")
            }
        } catch (error) { next(error) }
    }


    public feCaseHistoryDatatable = async (req: any, res: Response, next: NextFunction) => {
        try {
            let condition = [];
            let array1 = [];
            let array2 = [];
            let array3 = [];
            const { id, date1, date2 } = req.body;
            const today = moment().utcOffset('+05:30');
            const earlierDate = today.subtract(2, 'months');
            let searchArray = await feCaseHistorySearch(req.body.columns);
            array3.push(
                {
                    '$match': {
                        'fieldExecutiveId': new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    '$match': {
                        date: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) }
                    },
                },
                {
                    '$unwind': {
                        'path': '$submittedCases',
                        'preserveNullAndEmptyArrays': true
                    }
                },
                {
                    '$sort': {
                        'submittedCases.submittedDate': -1
                    }
                },
                {
                    '$project': {
                        'submittedCases': 1
                    }
                },
                {
                    '$match': {
                        'submittedCases.submittedDate': {
                            $gte: new Date(moment(date1).format('YYYY-MM-DD')),
                            $lte: new Date(moment(date2).add(1, "days").format('YYYY-MM-DD'))
                        }
                    }
                },
                {
                    $count: "sum",
                });

            array2.push(
                {
                    '$match': {
                        'fieldExecutiveId': new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    '$match': {
                        date: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) }
                    },
                },
                {
                    '$unwind': {
                        'path': '$submittedCases',
                        'preserveNullAndEmptyArrays': true
                    }
                },
                {
                    '$sort': {
                        'submittedCases.submittedDate': -1
                    }
                },
                {
                    '$project': {
                        'submittedCases': 1
                    }
                },
                {
                    '$match': {
                        'submittedCases.submittedDate': {
                            $gte: new Date(moment(date1).format('YYYY-MM-DD')),
                            $lte: new Date(moment(date2).add(1, "days").format('YYYY-MM-DD'))
                        }
                    }
                },
            );

            array1.push(
                {
                    '$match': {
                        'fieldExecutiveId': new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    '$match': {
                        date: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) }
                    },
                },
                {
                    '$unwind': {
                        'path': '$submittedCases',
                        'preserveNullAndEmptyArrays': true
                    }
                },
                {
                    '$sort': {
                        'submittedCases.submittedDate': -1
                    }
                },
                {
                    '$project': {
                        'submittedCases': 1
                    }
                },
                {
                    '$match': {
                        'submittedCases.submittedDate': {
                            $gte: new Date(moment(date1).format('YYYY-MM-DD')),
                            $lte: new Date(moment(date2).add(1, "days").format('YYYY-MM-DD'))
                        }
                    }
                },
            );

            if (req.body.columns[5].search.value.length > 0) {
                array1.push({
                    $addFields: {
                        "submittedDate_string": {
                            $toString: "$submittedCases.submittedDate",
                        },
                    },
                });
                array2.push({
                    $addFields: {
                        "submittedDate_string": {
                            $toString: "$submittedCases.submittedDate",
                        },
                    },
                });
            }

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
            const [feCases] = await feSubmittedCasesModel.aggregate(condition);
            let count = parseInt(req.body.start) + 1;
            if (feCases) {
                for (let i = 0; i < feCases.data.length; i++) {

                    data.push({
                        count: count,
                        assignedDate: moment(feCases.data[i]?.submittedCases.assignedDate).utc().format("YYYY-MM-DD") || "NA",
                        assignedTime: moment(feCases.data[i]?.submittedCases.assignedDate).utc().format("HH:mm:ss") || "NA",
                        acceptedDate: moment(feCases.data[i].submittedCases.acceptedDate).utc().format("YYYY-MM-DD"),
                        acceptedTime: moment(feCases.data[i].submittedCases.acceptedDate).utc().format("HH:mm:ss"),
                        submittedDate: moment(feCases.data[i].submittedCases.submittedDate).utc().format("YYYY-MM-DD") || "NA",
                        submittedTime: moment(feCases.data[i].submittedCases.submittedDate).utc().format("HH:mm:ss") || "NA",
                        fileNo: feCases.data[i].submittedCases.fileNo || "NA",
                        applicantName: feCases.data[i].submittedCases.applicantName || "NA",
                        addressType: feCases.data[i].submittedCases.addressType || "NA",
                        address: feCases.data[i].submittedCases.address || "NA",
                        bank: feCases.data[i].submittedCases.bank || "NA",
                        product: feCases.data[i].submittedCases.product || "NA",
                    });
                    count++;
                }
                if (data.length == feCases.data.length) {
                    let jsonData = JSON.stringify({
                        draw: parseInt(req.body.draw),
                        recordsTotal: feCases.sum1.sum,
                        recordsFiltered: feCases.sum2.sum,
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
    }
}

export default adminController;