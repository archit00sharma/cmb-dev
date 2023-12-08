import { NextFunction, Request, Response } from "express";
import fieldExecutiveService from "../../services/fieldExecutiveServices/fieldExecutive.service"
import fieldExecutiveModel from "../../models/fieldExecutive.model";
import areaModel from "../../models/area.model";
import productModel from "../../models/product.model";
import bankModel from "../../models/bank.model";
import Helper from "@/utils/helper";
import caseModel from "@/models/case.model";
import feDistanceModel from "@/models/fieldExecutiveDistance.model";
import mongoose, { Aggregate } from "mongoose";
import moment from "moment";
import { AnyARecord } from "dns";


class fieldExecutiveController {
    public Helper = new Helper();
    public fieldExecutiveService = new fieldExecutiveService();

    public addFieldExecutive = async (req: any, res: Response, next: NextFunction) => {
        try {

            let role = req.user.role;
            let email = req.user.email;
            let area = await areaModel.find();
            let product = await productModel.find();
            let bank = await bankModel.find();
            res.locals.message = req.flash();
            res.render("fieldExecutive/addFieldExecutive", { role, email, area, product, bank })
        } catch (error) { next(error) }

    }
    public addFieldExecutiveData = async (req: any, res: Response, next: NextFunction) => {
        try {

            if (req.fileValidationError) {
                req.flash("error", req.fileValidationError)
                res.redirect("/field-executive/addFieldExecutive")
            } else {
                const addFieldExecutiveDataConfirmation: any = await this.fieldExecutiveService.addFieldExecutiveData(req);
                if (addFieldExecutiveDataConfirmation.code == 201) {
                    req.flash("success", addFieldExecutiveDataConfirmation.message)
                    res.redirect("/field-executive/viewFieldExecutive")
                } else {
                    if (req.file) {
                        this.Helper.deleteObjectAWS(req.file.key)
                    }
                    req.flash("error", addFieldExecutiveDataConfirmation.message)
                    res.redirect("/field-executive/addFieldExecutive")
                }
            }

        } catch (error) { next(error) }

    }
    public viewFieldExecutive = async (req: any, res: Response, next: NextFunction) => {
        try {
            let role: any = req.user.role
            let email = req.user.email
            res.locals.message = req.flash();
            res.render("fieldExecutive/viewFieldExecutive", { role, email, })
        } catch (error) { next(error) }
    }
    public viewFieldExecutiveDatatable = async (req: any, res: Response, next: NextFunction) => {
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
            fieldExecutiveModel.countDocuments(condition).exec((err, row) => {
                if (err) next(err);
                let data: any = [];
                let count: any = 1;
                fieldExecutiveModel.aggregate(condition).exec((err, rows) => {
                    if (err) next(err);
                    rows.forEach((doc: any) => {
                        data.push({
                            count: count,
                            name: doc.fullName,
                            email: doc.email,
                            cases: `<button onclick="myFunction1('${doc._id}')" type="button" class="btn btn-info btn-rounded">Cases Info</button>`,
                            pancard: doc.panCard,
                            mobile: doc.mobile,
                            aadhaarcard: doc.aadhaarCard,
                            action: req.user.role == "admin" ? `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/field-executive/editFieldExecutive/${doc._id}" data-original-title="Edit">
                                    <i class="fas fa-pencil"></i>
                                </a>
                                <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert('/field-executive/deleteFieldExecutive/${doc._id}', 'Are you sure you want to delete this data?')" data-original-title="Delete">
                                <i class="far fa-trash-alt"></i> </a>
                        </div>`: `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/field-executive/editFieldExecutive/${doc._id}" data-original-title="Edit">
                        <i class="fas fa-pencil"></i>
                    </a>
                    <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert('', 'Are you sure you want to delete this data?')" data-original-title="Delete">
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
    public editFieldExecutive = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role === "admin") {
                let role = req.user.role;
                let email = req.user.email
                let id = req.params.id
                let fieldExecutiveData: any = await fieldExecutiveModel.findOne({ _id: req.params.id })
                let area = await areaModel.find();
                let product = await productModel.find();
                let bank = await bankModel.find();
                let x = await this.Helper.getSignedUrlAWS(fieldExecutiveData.profilePic)
                res.locals.message = req.flash()
                res.render("fieldExecutive/editFieldExecutive", { role, email, id, area, product, bank, fieldExecutiveData, x })
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/field-executive/viewFieldExecutive")
            }
        } catch (error) { next(error) }

    }
    public editFieldExecutiveData = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.fileValidationError) {
                req.flash("error", req.fileValidationError)
                res.redirect("/field-executive/addFieldExecutive")
            } else {
                if (req.user.role == "admin") {
                    let role = req.user.role;
                    let email = req.user.email
                    const editFieldExecutiveConfirmation: any = await this.fieldExecutiveService.editFieldExecutiveData(req);
                    if (editFieldExecutiveConfirmation.code == 201) {
                        if (req.file) {
                            this.Helper.deleteObjectAWS(req.body.pic)
                        }
                        req.flash("success", editFieldExecutiveConfirmation.message)
                        res.redirect("/field-executive/viewFieldExecutive")
                    } else {
                        if (req.file) {
                            this.Helper.deleteObjectAWS(req.file.key)
                        }
                        req.flash("error", editFieldExecutiveConfirmation.message)
                        res.redirect(`${req.body.myUrl}`)
                    }

                }
                else {
                    req.flash("error", "Access Denied")
                    res.redirect("/field-executive/viewFieldExecutive")
                }

            }
        } catch (error) { next(error) }

    }
    public deleteFieldExecutive = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const deleteFieldExecutiveDataConfirmation: any = await this.fieldExecutiveService.deleteFieldExecutiveData(req);
                if (deleteFieldExecutiveDataConfirmation.code == 201) {
                    req.flash("success", deleteFieldExecutiveDataConfirmation.message)
                } else {
                    req.flash("error", deleteFieldExecutiveDataConfirmation.message)
                }

            } else {
                req.flash("error", "Access Denied")
            }
            res.redirect("/field-executive/viewFieldExecutive")
        } catch (error) { next(error) }

    }
    public caseCount = async (req: any, res: Response, next: NextFunction) => {
        try {
            // let findDoc: any = await caseModel.find()
            // for (let i = 0; i < findDoc.length; i++) {
            //     let fieldExecutive: any = {}
            //     let manager: any = {}
            //     let seniorSupervisor: any = {}
            //     let supervisor: any = {}
            //     let admin: any = {}
            //     let caseUploaded: any = ""
            //     let document = []

            //     if (findDoc[i].caseUploaded) {
            //         console.log("ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg")
            //         console.log("findDoc[i].caseUploaded>>>>>>>.", moment(findDoc[i].caseUploaded, "DD-MM-YYYY @ hh:mm:ss").utcOffset(330).format())
            //         caseUploaded = new Date(moment(findDoc[i].caseUploaded, "DD-MM-YYYY @ hh:mm:ss").utc().format())
            //         caseUploaded = new Date(moment(caseUploaded).add(330, "minutes").format())
            //         console.log("caseUploaded>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.", caseUploaded)
            //     }

            //     if (findDoc[i].fieldExecutive && findDoc[i].fieldExecutive[0]) {
            //         let feAssignedDate: any = findDoc[i].fieldExecutive[0].substring(findDoc[i].fieldExecutive[0].indexOf(",") + 1, findDoc[i].fieldExecutive[0].lastIndexOf("@"))
            //         feAssignedDate = feAssignedDate.replaceAll("/", "-")
            //         let time = findDoc[i].fieldExecutive[0].substring(findDoc[i].fieldExecutive[0].indexOf('@ ') + 1)
            //         let totalDate = new Date(moment(feAssignedDate, "DD-MM-YYYY").format("YYYY-MM-DD") + "" + time)
            //         let currentdate: any = new Date(totalDate.getTime() + (330) * 60000);
            //         fieldExecutive.name = findDoc[i].fieldExecutive[0].replace('assigned', '').replace('Last Sync:', "").substr(0, findDoc[i].fieldExecutive[0].replace('assigned', '').replace('Last Sync:', "").indexOf(','))
            //         fieldExecutive.assignedDate = currentdate
            //     }
            //     if (findDoc[i].fieldExecutive && findDoc[i].fieldExecutive[1]) {
            //         let feAcceptedDate: any = findDoc[i].fieldExecutive[1].replace(",accepted", "").substring(findDoc[i].fieldExecutive[1].replace(",accepted", "").indexOf(",") + 1, findDoc[i].fieldExecutive[1].replace(",accepted", "").lastIndexOf("@"))
            //         feAcceptedDate = feAcceptedDate.replaceAll("/", "-")
            //         let time = findDoc[i].fieldExecutive[1].substring(findDoc[i].fieldExecutive[1].indexOf('@ ') + 1)
            //         let totalDate = new Date(moment(feAcceptedDate, "DD-MM-YYYY").format("YYYY-MM-DD") + "" + time)
            //         let currentdate: any = new Date(totalDate.getTime() + (330) * 60000);
            //         fieldExecutive.name = findDoc[i].fieldExecutive[1].substr(0, findDoc[i].fieldExecutive[1].indexOf(','))
            //         fieldExecutive.acceptedDate = currentdate
            //     }
            //     if (findDoc[i].fieldExecutive && findDoc[i].fieldExecutive[2]) {
            //         let feSubmittedDate: any = findDoc[i].fieldExecutive[2].replace(",submited", "").substring(findDoc[i].fieldExecutive[2].replace(",submited", "").indexOf(",") + 1, findDoc[i].fieldExecutive[2].replace(",submited", "").lastIndexOf("@"))
            //         feSubmittedDate = feSubmittedDate.replaceAll("/", "-")
            //         let time = findDoc[i].fieldExecutive[2].substring(findDoc[i].fieldExecutive[2].indexOf('@ ') + 1)
            //         let totalDate = new Date(moment(feSubmittedDate, "DD-MM-YYYY").format("YYYY-MM-DD") + "" + time)
            //         let currentdate: any = new Date(totalDate.getTime() + (330) * 60000);
            //         fieldExecutive.submittedDate = currentdate
            //     }

            //     if (findDoc[i].manager && findDoc[i].manager[0]) {
            //         let managerAcceptedDate: any = findDoc[i].manager[0].substring(findDoc[i].manager[0].indexOf(",") + 1, findDoc[i].manager[0].lastIndexOf("@"))
            //         managerAcceptedDate = managerAcceptedDate.replaceAll("/", "-")
            //         let time = findDoc[i].manager[0].substring(findDoc[i].manager[0].indexOf('@ ') + 1)
            //         let totalDate = new Date(moment(managerAcceptedDate, "DD-MM-YYYY").format("YYYY-MM-DD") + "" + time)
            //         let currentdate: any = new Date(totalDate.getTime() + (330) * 60000);
            //         manager.name = findDoc[i].manager[0].replace('Last Sync:', "").substr(0, findDoc[i].manager[0].replace('Last Sync:', "").indexOf(','))
            //         manager.assignedDate = currentdate
            //     }
            //     if (findDoc[i].manager && findDoc[i].manager[1]) {
            //         let managerSubmittedDate: any = findDoc[i].manager[1].substring(findDoc[i].manager[1].indexOf(",") + 1, findDoc[i].manager[1].lastIndexOf("@"))
            //         managerSubmittedDate = managerSubmittedDate.replaceAll("/", "-")
            //         let time = findDoc[i].manager[1].substring(findDoc[i].manager[1].indexOf('@ ') + 1)
            //         let totalDate = new Date(moment(managerSubmittedDate, "DD-MM-YYYY").format("YYYY-MM-DD") + "" + time)
            //         let currentdate: any = new Date(totalDate.getTime() + (330) * 60000);
            //         manager.name = findDoc[i].manager[1].substr(0, findDoc[i].manager[1].indexOf(','))
            //         manager.submittedDate = currentdate
            //     }
            //     if (findDoc[i].seniorSupervisor && findDoc[i].seniorSupervisor[0]) {
            //         let seniorSupervisorAcceptedDate: any = findDoc[i].seniorSupervisor[0].substring(findDoc[i].seniorSupervisor[0].indexOf(",") + 1, findDoc[i].seniorSupervisor[0].lastIndexOf("@"))
            //         seniorSupervisorAcceptedDate = seniorSupervisorAcceptedDate.replaceAll("/", "-")
            //         let time = findDoc[i].seniorSupervisor[0].substring(findDoc[i].seniorSupervisor[0].indexOf('@ ') + 1)
            //         let totalDate = new Date(moment(seniorSupervisorAcceptedDate, "DD-MM-YYYY").format("YYYY-MM-DD") + "" + time)
            //         let currentdate: any = new Date(totalDate.getTime() + (330) * 60000);
            //         seniorSupervisor.name = findDoc[i].seniorSupervisor[0].replace('Last Sync:', "").substr(0, findDoc[i].seniorSupervisor[0].replace('Last Sync:', "").indexOf(','))
            //         seniorSupervisor.assignedDate = currentdate
            //     }
            //     if (findDoc[i].seniorSupervisor && findDoc[i].seniorSupervisor[1]) {
            //         let seniorSupervisorSubmittedDate: any = findDoc[i].seniorSupervisor[1].substring(findDoc[i].seniorSupervisor[1].indexOf(",") + 1, findDoc[i].seniorSupervisor[1].lastIndexOf("@"))
            //         seniorSupervisorSubmittedDate = seniorSupervisorSubmittedDate.replaceAll("/", "-")
            //         let time = findDoc[i].seniorSupervisor[1].substring(findDoc[i].seniorSupervisor[1].indexOf('@ ') + 1)
            //         let totalDate = new Date(moment(seniorSupervisorSubmittedDate, "DD-MM-YYYY").format("YYYY-MM-DD") + "" + time)
            //         let currentdate: any = new Date(totalDate.getTime() + (330) * 60000);
            //         seniorSupervisor.name = findDoc[i].seniorSupervisor[1].substr(0, findDoc[i].seniorSupervisor[1].indexOf(','))
            //         seniorSupervisor.submittedDate = currentdate
            //     }
            //     if (findDoc[i].supervisor && findDoc[i].supervisor[0]) {
            //         let supervisorAcceptedDate: any = findDoc[i].supervisor[0].substring(findDoc[i].supervisor[0].indexOf(",") + 1, findDoc[i].supervisor[0].lastIndexOf("@"))
            //         supervisorAcceptedDate = supervisorAcceptedDate.replaceAll("/", "-")
            //         let time = findDoc[i].supervisor[0].substring(findDoc[i].supervisor[0].indexOf('@ ') + 1)
            //         let totalDate = new Date(moment(supervisorAcceptedDate, "DD-MM-YYYY").format("YYYY-MM-DD") + "" + time)
            //         let currentdate: any = new Date(totalDate.getTime() + (330) * 60000);
            //         supervisor.name = findDoc[i].supervisor[0].replace('Last Sync:', "").substr(0, findDoc[i].supervisor[0].replace('Last Sync:', "").indexOf(','))
            //         supervisor.assignedDate = currentdate
            //     }
            //     if (findDoc[i].supervisor && findDoc[i].supervisor[1]) {
            //         let supervisorSubmittedDate: any = findDoc[i].supervisor[1].substring(findDoc[i].supervisor[1].indexOf(",") + 1, findDoc[i].supervisor[1].lastIndexOf("@"))
            //         supervisorSubmittedDate = supervisorSubmittedDate.replaceAll("/", "-")
            //         let time = findDoc[i].supervisor[1].substring(findDoc[i].supervisor[1].indexOf('@ ') + 1)
            //         let totalDate = new Date(moment(supervisorSubmittedDate, "DD-MM-YYYY").format("YYYY-MM-DD") + "" + time)
            //         let currentdate: any = new Date(totalDate.getTime() + (330) * 60000);
            //         supervisor.name = findDoc[i].supervisor[1].substr(0, findDoc[i].supervisor[1].indexOf(','))
            //         supervisor.submittedDate = currentdate
            //     }

            //     if (findDoc[i].admin && findDoc[i].admin[0]) {
            //         let adminSubmittedDate: any = findDoc[i].admin[0].substring(findDoc[i].admin[0].indexOf(",") + 1, findDoc[i].admin[0].lastIndexOf("@"))
            //         adminSubmittedDate = adminSubmittedDate.replaceAll("/", "-")
            //         let time = findDoc[i].admin[0].substring(findDoc[i].admin[0].indexOf('@ ') + 1)
            //         let totalDate = new Date(moment(adminSubmittedDate, "DD-MM-YYYY").format("YYYY-MM-DD") + "" + time)
            //         let currentdate: any = new Date(totalDate.getTime() + (330) * 60000);
            //         admin.name = findDoc[i].admin[0].replace('Last Sync:', "").substr(0, findDoc[i].admin[0].replace('Last Sync:', "").indexOf(','))
            //         admin.submittedDate = currentdate
            //     }

            //     console.log("feObject>>>>>>>>>>>>>>>>>>>>>>>.", fieldExecutive, "manger>>>>>>>.", manager, "sennnnnnnnnnnnn", seniorSupervisor, "super>>>>>>>>>>>>>>>>>>>.", supervisor, "caseUplaod>>>>>>>>>>>>>>>", caseUploaded)
            //     let updateCase = await caseModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(findDoc[i]._id) }, { $set: { fieldExecutive: fieldExecutive, manager: manager, supervisor: supervisor, seniorSupervisor: seniorSupervisor, caseUploaded: caseUploaded, admin: admin, document: document } })
            // }
            let condition2 = []
            condition2.push({
                '$facet': {
                    'completedCases': [
                        {
                            '$match': {
                                '$and': [
                                    {
                                        'fieldExecutiveId': new mongoose.Types.ObjectId(`${req.body.id}`)
                                    },
                                    {
                                        'stage': 'submited'
                                    }
                                ]
                            }
                        }, {
                            '$count': 'count'
                        }
                    ],
                    'currentCases': [
                        {
                            '$match': {
                                '$and': [
                                    {
                                        'fieldExecutiveId': new mongoose.Types.ObjectId(`${req.body.id}`)
                                    },
                                    {
                                        'stage': {
                                            '$nin': [
                                                'submited', 'manager', 'supervisor'
                                            ]
                                        }
                                    }
                                ]
                            }
                        }, {
                            '$count': 'count'
                        }
                    ]
                }
            })
            let caseCount = await caseModel.aggregate(condition2)
            res.send(caseCount)

        } catch (error) { next(error) }

    }
    public distance = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const pipeline = [
                    {
                        '$match': {
                            '$and': [
                                {
                                    'fieldExecutiveId': new mongoose.Types.ObjectId(req.body.id)
                                }, {
                                    'date': {
                                        '$gte': new Date(req.body.from),
                                        '$lte': new Date(req.body.to)
                                    }
                                }
                            ]
                        }
                    }, {
                        '$group': {
                            '_id': '$fieldExecutiveId',
                            'totalDistance': {
                                '$sum': '$distance'
                            }
                        }
                    }
                ];
                const [feDistance] = await feDistanceModel.aggregate(pipeline)
               
                res.send(feDistance)
            } else {
                res.send("Access denied");
            }

        } catch (error) { next(error) }

    }
}

export default fieldExecutiveController;