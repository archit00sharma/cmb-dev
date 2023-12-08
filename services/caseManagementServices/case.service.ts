
import Messages from "../../messages";
import path from "path";
import reader from "xlsx";
import managerModel from "../../models/manager.model";
import seniorSupervisorModel from "../../models/seniorSupervisors.model";
import supervisorModel from "../../models/supervisors.model";
import fieldExecutiveModel from "../../models/fieldExecutive.model";
import caseModel from "../../models/case.model";
import mongoose from "mongoose";
import getDateTime from "@/helpers/getCurrentDateTime";
import validateReviewData from "@/helpers/validateReviewData";
import createExcelFile from "@/helpers/createExcelFile";
import Helper from "@/utils/helper";
import areaModel from "@/models/area.model";
import productModel from "@/models/product.model";
import bankModel from "@/models/bank.model";
import submitDuplicateCase from "@/helpers/submitDuplicateCase"
import moment from "moment"
import sendNotification from "../../helpers/firebase"
import userAllocationModel from "@/models/userAllocations.model";
import calTat from "@/helpers/tatCalculation/tatCal";
import Excel from "exceljs";
import tatFileModel from "../../models/tatFiles.model"
import fs from 'fs';
import feSubmittedCasesModel from '@/models/fieldExecutiveSubmittedCases.model';

class caseService {
    public Helper = new Helper();
    // *********  UPLOAD CASES AND ASSIGN AUTOMATICALLY    *****************************************************************************************
    public async addCaseData(req: any) {

        let obj: any = ""
        try {

            let datetime = await getDateTime();
            let manager: any = {}
            let supervisor: any = {}
            let seniorSupervisor: any = {}
            let caseData: any;
            if (req.file) {
                const uploadedFile = reader.readFile(
                    path.join(__dirname, "../../public/caseFile", `${req.file.filename}`),
                    { type: "binary", cellText: false, cellDates: true }
                );
                let data: any = [];
                obj = "";
                // **********get all areas  ******
                let getArea = await areaModel.find()
                // ****** get all product *********
                let getProduct = await productModel.find()
                // ****** get all bank*****
                let getBank = await bankModel.find()


                async function findAllocations(area: any, product: any, bank: any) {

                    const allocationPipeline: any = [
                        {
                            '$facet': {
                                'manager': [
                                    {
                                        '$match': {
                                            '$and': [
                                                {
                                                    'role': 'manager'
                                                }, {
                                                    'area': `${area.toUpperCase().trim()}`
                                                }, {
                                                    'product': `${product.toUpperCase().trim()}`
                                                }, {
                                                    'bank': `${bank.toUpperCase().trim()}`
                                                }
                                            ]
                                        }
                                    }, {
                                        '$lookup': {
                                            'from': 'managers',
                                            'localField': 'user_id',
                                            'foreignField': '_id',
                                            'as': 'user_id',
                                            'pipeline': [
                                                {
                                                    '$project': {
                                                        '_id': 1,
                                                        'fullName': 1
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ],
                                'seniorSupervisor': [
                                    {
                                        '$match': {
                                            '$and': [
                                                {
                                                    'role': 'senior-supervisor'
                                                }, {
                                                    'area': `${area.toUpperCase().trim()}`
                                                }, {
                                                    'product': `${product.toUpperCase().trim()}`
                                                }, {
                                                    'bank': `${bank.toUpperCase().trim()}`
                                                }
                                            ]
                                        }
                                    }, {
                                        '$lookup': {
                                            'from': 'seniorsupervisors',
                                            'localField': 'user_id',
                                            'foreignField': '_id',
                                            'as': 'user_id',
                                            'pipeline': [
                                                {
                                                    '$project': {
                                                        '_id': 1,
                                                        'fullName': 1
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ],
                                'supervisor': [
                                    {
                                        '$match': {
                                            '$and': [
                                                {
                                                    'role': 'supervisor'
                                                }, {
                                                    'area': `${area.toUpperCase().trim()}`
                                                }, {
                                                    'product': `${product.toUpperCase().trim()}`
                                                }, {
                                                    'bank': `${bank.toUpperCase().trim()}`
                                                }
                                            ]
                                        }
                                    }, {
                                        '$lookup': {
                                            'from': 'supervisors',
                                            'localField': 'user_id',
                                            'foreignField': '_id',
                                            'as': 'user_id',
                                            'pipeline': [
                                                {
                                                    '$project': {
                                                        '_id': 1,
                                                        'fullName': 1
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                    return await userAllocationModel.aggregate(allocationPipeline);


                }

                const sheets = uploadedFile.SheetNames;
                for (let i = 0; i < sheets.length; i++) {
                    const temp: any = reader.utils.sheet_to_json(
                        uploadedFile.Sheets[uploadedFile.SheetNames[i]],
                        { header: 0, raw: false, dateNF: 'DD-MM-YYYY' }
                    );
                    temp.forEach((res: any) => {
                        let y
                        let regex = "([0-1][0-9]|2[0-3]):([0-5][0-9])"
                        if (res.date == undefined || res.date == null || res.time == undefined || res.time == null ||
                            res.applicantName == undefined ||
                            res.applicantType == undefined || !["APPLICANT", "CO-APPLICANT", "GUARANTOR"].includes(res.applicantType.toUpperCase().trim()) ||
                            res.addressType == undefined ||
                            res.address == undefined ||
                            res.area == undefined ||
                            res.bank == undefined ||
                            res.product == undefined || res.sNo == undefined ||
                            res.mobileNo == undefined ||
                            res.fileNo.trim().toString() == undefined ||
                            !["RV", "BV", "PV"].includes(res.addressType.trim().toUpperCase()) ||
                            isNaN(res.mobileNo.trim()) == true ||
                            res.mobileNo.trim().toString().length != 10 ||
                            ![0, 1, 2].includes(parseInt(res.point))
                        ) {
                            let myRow
                            if (res.sNo) {
                                myRow = res.sNo;
                            }
                            else {
                                myRow = "(row no missing or data is outside the required columns or rows )"
                            }
                            Messages.Failed.CASES.IMPROPER_DATA.message = `Improper or Empty data found in Row No ${myRow}`;
                            throw Messages.Failed.CASES.IMPROPER_DATA;
                        }
                        if (moment(res.date.trim(), 'DD-MM-YYYY', true).isValid() == false) {
                            Messages.Failed.CASES.IMPROPER_DATA.message = `improper date in row no ${res.sNo}`;
                            throw Messages.Failed.CASES.IMPROPER_DATA;
                        }
                        if (res.time) {
                            y = (res.time).match(regex)
                        }
                        if (!y) {
                            Messages.Failed.CASES.IMPROPER_DATA.message = `improper time in row no ${res.sNo}`;
                            throw Messages.Failed.CASES.IMPROPER_DATA;
                        } else {
                            res.time = y[0]
                        }
                        function searchArea(area, getArea) {
                            for (var i = 0; i < getArea.length; i++) {
                                if (getArea[i].area.trim().toUpperCase() === area) {
                                    return "true"
                                }
                            }
                        }
                        function searchProduct(product, getProduct) {
                            for (var i = 0; i < getProduct.length; i++) {
                                if (getProduct[i].product.trim().toUpperCase() === product) {
                                    return "true"
                                }
                            }
                        }
                        function searchBank(bank, getBank) {
                            for (var i = 0; i < getBank.length; i++) {

                                if (getBank[i].bank.trim().toUpperCase() === bank) {
                                    return "true"
                                }
                            }
                        }
                        var checkProduct: any
                        var checkBank: any
                        var checkArea: any = searchArea(res.area.trim().toUpperCase(), getArea);
                        if (checkArea != "true") {
                            obj = {
                                status: false,
                                code: 401,
                                message: `Area not existed from row no ${res.sNo}`
                            }
                            throw obj
                        } else {

                            checkProduct = searchProduct(res.product.trim().toUpperCase(), getProduct);

                            if (checkProduct != "true") {
                                obj = {
                                    status: false,
                                    code: 401,
                                    message: `Product not existed from row no ${res.sNo}`
                                }
                                throw obj
                            } else {

                                checkBank = searchBank(res.bank.trim().toUpperCase(), getBank);

                                if (checkBank != "true") {
                                    obj = {
                                        status: false,
                                        code: 401,
                                        message: `Bank not existed from row no ${res.sNo}`
                                    }
                                    throw obj
                                }
                            }
                        }
                        data.push(res);
                    });
                }
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        let condition = []
                        condition.push({
                            $facet: {
                                "caseFind": [
                                    {
                                        $match: {
                                            $or: [
                                                {
                                                    fileNo: data[i].fileNo.trim().toString()
                                                },
                                                {
                                                    mobileNo: parseInt(data[i].mobileNo.trim())
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        $limit: 1
                                    }
                                ],
                                "caseFind2": [
                                    {
                                        $match: {
                                            $or: [
                                                {
                                                    fileNo: data[i].fileNo.trim().toString()
                                                },
                                                {
                                                    mobileNo: parseInt(data[i].mobileNo.trim())
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        $match: {
                                            parentId: {
                                                $exists: true
                                            }
                                        }
                                    },
                                    {
                                        $limit: 1
                                    }
                                ],
                                "caseFind3": [
                                    {
                                        $match: {
                                            $or: [
                                                {
                                                    fileNo: data[i].fileNo.trim().toString()
                                                },
                                                {
                                                    mobileNo: parseInt(data[i].mobileNo.trim())
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        $match: {
                                            $and: [{ date: data[i].date.trim().toString() }, { time: data[i].time.toString() }]
                                        }
                                    },
                                    {
                                        $limit: 1
                                    }
                                ]
                            }
                        })

                        let caseSearch: any = await caseModel.aggregate(condition)

                        let logs: any = {};
                        let caseDataObject: any = {
                            date: data[i].date.trim().toString(),
                            time: data[i].time.trim().toString(),
                            fileNo: data[i].fileNo.trim().toString(),
                            barCode: data[i].barCode ? data[i].barCode.trim() : "",
                            applicantName: data[i].applicantName.trim(),
                            applicantType: data[i].applicantType.trim().toUpperCase(),
                            addressType: data[i].addressType.trim().toUpperCase(),
                            officeName: data[i].officeName ? data[i].officeName.trim() : "",
                            address: data[i].address ? data[i].address.trim() : "",
                            pinCode: data[i].pinCode ? data[i].pinCode.trim() : "",
                            branch: data[i].branch ? data[i].branch.trim() : "",
                            area: data[i].area ? data[i].area.trim().toUpperCase() : "",
                            bank: data[i].bank ? data[i].bank.trim().toUpperCase() : "",
                            product: data[i].product ? data[i].product.trim().toUpperCase() : "",
                            mobileNo: data[i].mobileNo ? parseInt(data[i].mobileNo.trim()) : "",
                            point: parseInt(data[i].point.trim())
                        };
                        if (caseSearch && caseSearch[0] && caseSearch[0].caseFind.length > 0) {

                            const [allocationData] = await findAllocations(data[i].area, data[i].product, data[i].bank)

                            if (allocationData?.supervisor?.[0]) {
                                supervisor.name = allocationData.supervisor[0].user_id?.[0]?.fullName
                                supervisor.assignedDate = datetime
                                caseDataObject.supervisor = supervisor
                                caseDataObject.supervisorId = allocationData.supervisor[0].user_id?.[0]?._id;
                                logs.message = `Supervisor Assigned (Name:${allocationData.supervisor[0].user_id?.[0]?.fullName})`;
                            }
                            if (allocationData?.seniorSupervisor?.[0]) {

                                seniorSupervisor.name = allocationData.seniorSupervisor[0].user_id?.[0]?.fullName;
                                seniorSupervisor.assignedDate = datetime
                                caseDataObject.seniorSupervisor = seniorSupervisor
                                caseDataObject.seniorSupervisorId = allocationData.seniorSupervisor[0].user_id?.[0]?._id;
                                logs.message = logs.message == undefined ? `Senior-Supervisor Assigned (Name:${allocationData.seniorSupervisor[0].user_id?.[0]?.fullName})` : `${logs.message},Senior-Supervisor Assigned (Name:${allocationData.seniorSupervisor[0].user_id?.[0]?.fullName})`;
                            }
                            if (allocationData?.manager?.[0]) {
                                manager.name = allocationData.manager[0].user_id?.[0]?.fullName;
                                manager.assignedDate = datetime
                                caseDataObject.manager = manager
                                caseDataObject.managerId = allocationData.manager[0].user_id?.[0]?._id;
                                logs.message = logs.message == undefined ? `Manager Assigned (Name:${allocationData.manager[0].user_id?.[0]?.fullName})` : `${logs.message}, Manager Assigned (Name:${allocationData.manager[0].user_id?.[0]?.fullName})`;
                            }
                            if (caseSearch[0].caseFind2.length > 0) {
                                caseDataObject.parentId = caseSearch[0].caseFind2[0].parentId;
                            } else {
                                caseDataObject.parentId = caseSearch[0].caseFind[0]._id;
                            }
                            if (caseSearch[0].caseFind3.length <= 0) {
                                if (caseSearch[0].caseFind2.length > 0) {
                                    logs.DuplicateFrom = `FileNo:${caseSearch[0].caseFind2[0].fileNo},MobileNo:${caseSearch[0].caseFind2[0].mobileNo},Date:${caseSearch[0].caseFind2[0].date},Time:${caseSearch[0].caseFind2[0].time},ApplicantName:${caseSearch[0].caseFind2[0].applicantName},ParentId:${caseSearch[0].caseFind2[0].parentId}`
                                } else {
                                    logs.DuplicateFrom = `FileNo:${caseSearch[0].caseFind[0].fileNo},MobileNo:${caseSearch[0].caseFind[0].mobileNo},Date:${caseSearch[0].caseFind[0].date},Time:${caseSearch[0].caseFind[0].time},ApplicantName:${caseSearch[0].caseFind[0].applicantName},ParentId:${caseSearch[0].caseFind[0]._id}`
                                }
                                caseDataObject.duplicate = true;
                            } else if (caseSearch[0].caseFind3[0].duplicate == true) {
                                logs.DuplicateFrom = `FileNo:${caseSearch[0].caseFind3[0].fileNo},MobileNo:${caseSearch[0].caseFind3[0].mobileNo},Date:${caseSearch[0].caseFind3[0].date},Time:${caseSearch[0].caseFind3[0].time},ApplicantName:${caseSearch[0].caseFind3[0].applicantName},ParentId:${caseSearch[0].caseFind3[0].parentId}`
                                caseDataObject.duplicate = true;
                            }
                        } else {
                            const [allocationData] = await findAllocations(data[i].area, data[i].product, data[i].bank)


                            if (allocationData?.supervisor?.[0]) {
                                supervisor.name = allocationData.supervisor[0].user_id?.[0]?.fullName
                                supervisor.assignedDate = datetime
                                caseDataObject.supervisor = supervisor
                                caseDataObject.supervisorId = allocationData.supervisor[0].user_id?.[0]?._id;
                                logs.message = `Supervisor Assigned (Name: ${allocationData.supervisor[0].user_id?.[0]?.fullName})`;
                            }
                            if (allocationData?.seniorSupervisor?.[0]) {
                                seniorSupervisor.name = allocationData.seniorSupervisor[0].user_id?.[0]?.fullName;
                                seniorSupervisor.assignedDate = datetime
                                caseDataObject.seniorSupervisor = seniorSupervisor
                                caseDataObject.seniorSupervisorId = allocationData.seniorSupervisor[0].user_id?.[0]?._id;
                                logs.message = logs.message == undefined ? `Senior-Supervisor Assigned (Name:${allocationData.seniorSupervisor[0].user_id?.[0]?.fullName})` : `${logs.message},Senior-Supervisor Assigned (Name:${allocationData.seniorSupervisor[0].user_id?.[0]?.fullName}) `;
                            }
                            if (allocationData?.manager?.[0]) {
                                manager.name = allocationData.manager[0].user_id?.[0]?.fullName;
                                manager.assignedDate = datetime
                                caseDataObject.manager = manager
                                caseDataObject.managerId = allocationData.manager[0].user_id?.[0]?._id;
                                logs.message = logs.message == undefined ? `Manager Assigned (Name:${allocationData.manager[0].user_id?.[0]?.fullName})` : `${logs.message}, Manager Assigned (Name:${allocationData.manager[0].user_id?.[0]?.fullName})`;
                            }
                        }
                        logs.case = `Case uploaded by ${req.user.role},[NAME:${req.user.fullName}]`;
                        logs.createdAt = moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss");
                        let caseUploaded: any = ""
                        caseUploaded = datetime
                        caseDataObject.caseUploaded = caseUploaded
                        caseDataObject.logs = logs;
                        caseData = await caseModel.create(caseDataObject);


                    }
                    if (caseData) {
                        return Messages.SUCCESS.CASES.CASE_UPLOADED;
                    } else {
                        return Messages.Failed.SOMETHING_WENT_WRONG;
                    }
                } else {
                    return Messages.Failed.SOMETHING_WENT_WRONG;
                }
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG;
            }
        } catch (error) {

            if (error.message) {
                return error
            }
            if (obj) {
                return obj
            }
            return Messages.Failed.SOMETHING_WENT_WRONG;
        }
    }
    // **********************    EDIT CASES  *****************************************************************************************
    public async editCaseData(req: any) {
        try {
            let logs: any = {};
            let datetime = getDateTime();
            logs.updatedAt = moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss");
            logs.messege = "case details edited";
            let updateCaseData = await caseModel.updateOne(
                { _id: req.body.id },
                {
                    $set: {
                        applicantName: req.body.applicantName.trim(),
                        applicantType: req.body.applicantType.trim().toUpperCase(),
                        addressType: req.body.addressType.trim().toUpperCase(),
                        address: req.body.address.trim(),
                        pinCode: req.body.pinCode.trim(),
                    },
                    $push: { logs: logs },
                }
            );
            if (updateCaseData.modifiedCount > 0) {
                return Messages.SUCCESS.UPDATED_SUCCESSFULLY;
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG;
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }
    // **********************      DELETE CASES    *************************************************************************
    public async deleteCaseData(req: any) {
        try {
            let logs: any = {};
            logs.message = "case Deleted";
            let datetime = getDateTime();
            logs.deletedAt = moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss");
            let deleteCase = await caseModel.findOneAndDelete(
                { _id: req.query.id },
                { $push: { logs: logs } }
            );
            if (deleteCase) {
                return Messages.SUCCESS.DELETED_SUCCESSFULLY;
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG;
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }
    //***********************  ASSIGN CASES TO MEMBERS MANUALLY  *************************************************************************
    public async assignManagerCaseData(req: any) {
        try {
            let condition = [];
            condition.push(
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(`${req.query.id}`),
                    },
                },
                {
                    $lookup: {
                        from: "areas",
                        localField: "area",
                        foreignField: "area",
                        as: "area",
                    },
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "product",
                        foreignField: "product",
                        as: "product",
                    },
                },
                {
                    $lookup: {
                        from: "banks",
                        localField: "bank",
                        foreignField: "bank",
                        as: "bank",
                    },
                },
                {
                    $unwind: {
                        path: "$bank",
                    },
                },
                {
                    $unwind: {
                        path: "$area",
                    },
                },
                {
                    $unwind: {
                        path: "$product",
                    },
                }
            );
            let caseData = await caseModel.aggregate(condition);
            if (caseData && caseData.length > 0) {
                if (caseData[0].product || caseData[0].area || caseData[0].bank) {
                    if (
                        caseData[0].product.product &&
                        caseData[0].area.area &&
                        caseData[0].bank.bank
                    ) {
                        return Messages.SUCCESS.CASES.AREA_PRODUCT_BANK_EXISTS;
                    } else {
                        return Messages.Failed.CASES.AREA_PRODUCT_BANK_MISSING;
                    }
                } else {
                    return Messages.Failed.CASES.AREA_PRODUCT_BANK_MISSING;
                }
            } else {
                return Messages.Failed.CASES.AREA_PRODUCT_BANK_MISSING;
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }
    public async assignManagerCase(req: any) {
        try {
            const startTime = process.hrtime();
            let manager: any = {}
            let managerAssign: any;
            let logs: any = {};
            logs.message = "Manager Assigned Manually";
            let datetime = getDateTime();
            logs.createdAt = moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss");

            const pipeline = [
                {
                    '$match': {
                        '$and': [
                            {
                                'role': 'manager'
                            }, {
                                'area': `${req.body.area.toUpperCase().trim()}`
                            }, {
                                'product': `${req.body.product.toUpperCase().trim()}`
                            }, {
                                'bank': `${req.body.bank.toUpperCase().trim()}`
                            }
                        ]
                    }
                }, {
                    '$lookup': {
                        'from': 'managers',
                        'localField': 'user_id',
                        'foreignField': '_id',
                        'as': 'user_id',
                        'pipeline': [
                            {
                                '$project': {
                                    '_id': 1,
                                    'fullName': 1
                                }
                            }
                        ]
                    }
                }
            ]
            const [managerFind] = await userAllocationModel.aggregate(pipeline)


            async function assignMtoCase(id, manager) {
                let caseAssign = await caseModel.updateMany({ area: req.body.area, product: req.body.product, bank: req.body.bank, managerId: undefined }, { $set: { managerId: id, manager: manager }, $push: { logs: logs } })
                if (caseAssign.matchedCount > 0) {
                    const endTime = process.hrtime(startTime);
                    const elapsedTimeInMs = endTime[0] * 1000 + endTime[1] / 1e6;
                    console.log(`API execution time: ${elapsedTimeInMs} ms`);
                    return Messages.SUCCESS.UPDATED_SUCCESSFULLY
                } else {
                    return Messages.Failed.CASES.CASE_NOT_FOUND
                }
            }

            if (managerFind) {
                if (managerFind.user_id?.[0]?._id == req.body.managerId) {
                    manager.name = managerFind.user_id?.[0]?.fullName
                    manager.assignedDate = datetime
                    logs.message = `Manager Assigned Manually (${managerFind.user_id?.[0]?.fullName})`;
                    return await assignMtoCase(req.body.managerId, manager)
                } else {
                    return Messages.Failed.CASES.MANAGER_FIELDS_MISSING
                }
            } else {
                let addAllocation = await userAllocationModel.create({ user_id: req.body.managerId, area: req.body.area.trim().toUpperCase(), bank: req.body.bank.trim().toUpperCase(), product: req.body.product.trim().toUpperCase(), role: "manager" })
                if (addAllocation) {
                    const findManager = await managerModel.findOne({ _id: req.body.managerId })
                    manager.name = findManager.fullName;
                    manager.assignedDate = datetime;
                    logs.message = `Manager Assigned Manually (${findManager.fullName})`;
                    return await assignMtoCase(req.body.managerId, manager)
                } else {
                    return Messages.Failed.CASES.MANAGER_NOT_FOUND
                }
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }
    public async assignSeniorSupervisorCaseData(req: any) {
        try {
            let condition = [];
            condition.push(
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(`${req.query.id}`),
                    },
                },
                {
                    $lookup: {
                        from: "areas",
                        localField: "area",
                        foreignField: "area",
                        as: "area",
                    },
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "product",
                        foreignField: "product",
                        as: "product",
                    },
                },
                {
                    $lookup: {
                        from: "banks",
                        localField: "bank",
                        foreignField: "bank",
                        as: "bank",
                    },
                },
                {
                    $unwind: {
                        path: "$bank",
                    },
                },
                {
                    $unwind: {
                        path: "$area",
                    },
                },
                {
                    $unwind: {
                        path: "$product",
                    },
                }
            );
            let caseData = await caseModel.aggregate(condition);
            if (caseData && caseData.length > 0) {
                if (caseData[0].product || caseData[0].area || caseData[0].bank) {
                    if (
                        caseData[0].product.product &&
                        caseData[0].area.area &&
                        caseData[0].bank.bank
                    ) {
                        return Messages.SUCCESS.CASES.AREA_PRODUCT_BANK_EXISTS;
                    } else {
                        return Messages.Failed.CASES.AREA_PRODUCT_BANK_MISSING;
                    }
                } else {
                    return Messages.Failed.CASES.AREA_PRODUCT_BANK_MISSING;
                }
            } else {
                return Messages.Failed.CASES.AREA_PRODUCT_BANK_MISSING;
            }
        } catch (error) {

            error.code = 401
            return error
        }
    }
    public async assignSeniorSupervisorCase(req: any) {
        try {
            let seniorSupervisor: any = {}
            let seniorSupervisorAssign: any;
            let logs: any = {};
            logs.message = "seniorSupervisor Assigned Manually";
            let datetime = getDateTime();
            logs.createdAt = moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss");

            const pipeline = [
                {
                    '$match': {
                        '$and': [
                            {
                                'role': 'senior-supervisor'
                            }, {
                                'area': `${req.body.area.toUpperCase().trim()}`
                            }, {
                                'product': `${req.body.product.toUpperCase().trim()}`
                            }, {
                                'bank': `${req.body.bank.toUpperCase().trim()}`
                            }
                        ]
                    }
                }, {
                    '$lookup': {
                        'from': 'seniorsupervisors',
                        'localField': 'user_id',
                        'foreignField': '_id',
                        'as': 'user_id',
                        'pipeline': [
                            {
                                '$project': {
                                    '_id': 1,
                                    'fullName': 1
                                }
                            }
                        ]
                    }
                }
            ]
            const [seniorSupervisorFind] = await userAllocationModel.aggregate(pipeline)


            async function assignMtoCase(id, seniorSupervisor) {
                let caseAssign = await caseModel.updateMany({ area: req.body.area, product: req.body.product, bank: req.body.bank, seniorSupervisorId: undefined }, { $set: { seniorSupervisorId: id, seniorSupervisor: seniorSupervisor }, $push: { logs: logs } })
                if (caseAssign.matchedCount > 0) {
                    return Messages.SUCCESS.UPDATED_SUCCESSFULLY
                } else {
                    return Messages.Failed.CASES.CASE_NOT_FOUND
                }
            }
            if (seniorSupervisorFind) {
                if (seniorSupervisorFind.user_id?.[0]?._id == req.body.seniorSupervisorId) {
                    seniorSupervisor.name = seniorSupervisorFind.user_id?.[0]?.fullName
                    seniorSupervisor.assignedDate = datetime
                    logs.message = `seniorSupervisor Assigned Manually (${seniorSupervisorFind.user_id?.[0]?.fullName})`;
                    return await assignMtoCase(req.body.seniorSupervisorId, seniorSupervisor)
                } else {
                    return Messages.Failed.CASES.SENIOR_SUPERVISOR_FIELDS_MISSING
                }
            } else {
                let addAllocation = await userAllocationModel.create({ user_id: req.body.seniorSupervisorId, area: req.body.area.trim().toUpperCase(), bank: req.body.bank.trim().toUpperCase(), product: req.body.product.trim().toUpperCase(), role: "senior-supervisor" })
                if (addAllocation) {
                    const findSeniorSupervisor = await seniorSupervisorModel.findOne({ _id: req.body.seniorSupervisorId })
                    seniorSupervisor.name = findSeniorSupervisor.fullName;
                    seniorSupervisor.assignedDate = datetime;
                    logs.message = `seniorSupervisor Assigned Manually (${findSeniorSupervisor.fullName})`;
                    return await assignMtoCase(req.body.seniorSupervisorId, seniorSupervisor)
                } else {
                    return Messages.Failed.CASES.SENIOR_SUPERVISOR_NOT_FOUND
                }
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }
    public async assignSupervisorCaseData(req: any) {
        try {
            let condition = [];
            condition.push(
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(`${req.query.id}`),
                    },
                },
                {
                    $lookup: {
                        from: "areas",
                        localField: "area",
                        foreignField: "area",
                        as: "area",
                    },
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "product",
                        foreignField: "product",
                        as: "product",
                    },
                },
                {
                    $lookup: {
                        from: "banks",
                        localField: "bank",
                        foreignField: "bank",
                        as: "bank",
                    },
                },
                {
                    $unwind: {
                        path: "$bank",
                    },
                },
                {
                    $unwind: {
                        path: "$area",
                    },
                },
                {
                    $unwind: {
                        path: "$product",
                    },
                }
            );
            let caseData = await caseModel.aggregate(condition);
            if (caseData && caseData.length > 0) {
                if (caseData[0].product || caseData[0].area || caseData[0].bank) {
                    if (
                        caseData[0].product.product &&
                        caseData[0].area.area &&
                        caseData[0].bank.bank
                    ) {
                        return Messages.SUCCESS.CASES.AREA_PRODUCT_BANK_EXISTS;
                    } else {
                        return Messages.Failed.CASES.AREA_PRODUCT_BANK_MISSING;
                    }
                } else {
                    return Messages.Failed.CASES.AREA_PRODUCT_BANK_MISSING;
                }
            } else {
                return Messages.Failed.CASES.AREA_PRODUCT_BANK_MISSING;
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }
    public async assignSupervisorCase(req: any) {
        try {

            let supervisor: any = {}
            let supervisorAssign: any;
            let logs: any = {};
            logs.message = "supervisor Assigned Manually";
            let datetime = getDateTime();
            logs.createdAt = moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss");

            const pipeline = [
                {
                    '$match': {
                        '$and': [
                            {
                                'role': 'supervisor'
                            }, {
                                'area': `${req.body.area.toUpperCase().trim()}`
                            }, {
                                'product': `${req.body.product.toUpperCase().trim()}`
                            }, {
                                'bank': `${req.body.bank.toUpperCase().trim()}`
                            }
                        ]
                    }
                }, {
                    '$lookup': {
                        'from': 'supervisors',
                        'localField': 'user_id',
                        'foreignField': '_id',
                        'as': 'user_id',
                        'pipeline': [
                            {
                                '$project': {
                                    '_id': 1,
                                    'fullName': 1
                                }
                            }
                        ]
                    }
                }
            ]
            const [supervisorFind] = await userAllocationModel.aggregate(pipeline)

            async function assignMtoCase(id, supervisor) {
                let caseAssign = await caseModel.updateMany({ area: req.body.area, product: req.body.product, bank: req.body.bank, supervisorId: undefined }, { $set: { supervisorId: id, supervisor: supervisor }, $push: { logs: logs } })
                if (caseAssign.matchedCount > 0) {
                    return Messages.SUCCESS.UPDATED_SUCCESSFULLY
                } else {
                    return Messages.Failed.CASES.CASE_NOT_FOUND
                }
            }
            if (supervisorFind) {
                if (supervisorFind.user_id?.[0]?._id == req.body.supervisorId) {
                    supervisor.name = supervisorFind.user_id?.[0]?.fullName
                    supervisor.assignedDate = datetime
                    logs.message = `supervisor Assigned Manually (${supervisorFind.user_id?.[0]?.fullName})`;
                    return await assignMtoCase(req.body.supervisorId, supervisor)
                } else {
                    return Messages.Failed.CASES.SUPERVISOR_FIELDS_MISSING
                }
            } else {
                let addAllocation = await userAllocationModel.create({ user_id: req.body.supervisorId, area: req.body.area.trim().toUpperCase(), bank: req.body.bank.trim().toUpperCase(), product: req.body.product.trim().toUpperCase(), role: "supervisor" })
                if (addAllocation) {
                    const findSupervisor = await supervisorModel.findOne({ _id: req.body.supervisorId })
                    supervisor.name = findSupervisor.fullName
                    supervisor.assignedDate = datetime
                    logs.message = `supervisor Assigned Manually (${findSupervisor.fullName})`;
                    return await assignMtoCase(req.body.supervisorId, supervisor)
                } else {
                    return Messages.Failed.CASES.SUPERVISOR_NOT_FOUND
                }
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }
    public async assignFieldExecutiveCaseData(req: any) {
        try {
            let condition = [];
            condition.push(
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(`${req.query.id}`),
                    },
                },
                {
                    $lookup: {
                        from: "areas",
                        localField: "area",
                        foreignField: "area",
                        as: "area",
                    },
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "product",
                        foreignField: "product",
                        as: "product",
                    },
                },
                {
                    $lookup: {
                        from: "banks",
                        localField: "bank",
                        foreignField: "bank",
                        as: "bank",
                    },
                },
                {
                    $unwind: {
                        path: "$bank",
                    },
                },
                {
                    $unwind: {
                        path: "$area",
                    },
                },
                {
                    $unwind: {
                        path: "$product",
                    },
                }
            );
            let caseData = await caseModel.aggregate(condition);
            if (caseData && caseData.length > 0) {
                if (caseData[0].product || caseData[0].area || caseData[0].bank) {
                    if (
                        caseData[0].product.product &&
                        caseData[0].area.area &&
                        caseData[0].bank.bank
                    ) {
                        return Messages.SUCCESS.CASES.AREA_PRODUCT_BANK_EXISTS;
                    } else {
                        return Messages.Failed.CASES.AREA_PRODUCT_BANK_MISSING;
                    }
                } else {
                    return Messages.Failed.CASES.AREA_PRODUCT_BANK_MISSING;
                }
            } else {
                return Messages.Failed.CASES.AREA_PRODUCT_BANK_MISSING;
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }
    public async assignFieldExecutiveCase(req: any) {
        try {
            let fieldExecutive: any = {}
            let fieldExecutiveAssign

            let logs: any = {};
            let datetime = getDateTime();

            logs.createdAt = moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss");

            let checkfieldExecutive: any = await fieldExecutiveModel.findOne({ _id: req.body.fieldExecutiveId });

            if (checkfieldExecutive) {
                let assignFieldExecutive: any
                if (req.body.p == "p") {
                    let fieldExecutives: any = {}
                    fieldExecutives.name = checkfieldExecutive.fullName
                    fieldExecutives.assignedDate = datetime
                    logs.message = `New fieldExecutive Assigned (${checkfieldExecutive.fullName}) (replaced) by (${req.user.role} (${req.user.fullName}))`;
                    assignFieldExecutive = await caseModel.findOneAndUpdate({ _id: req.body.caseId, stage: { $nin: ["supervisor", "manager", "submited"] } }, { $set: { fieldExecutiveId: req.body.fieldExecutiveId, fieldExecutive: fieldExecutives }, $unset: { acceptedBy: "" }, $push: { logs: logs } })
                } else {
                    fieldExecutive.name = checkfieldExecutive.fullName
                    fieldExecutive.assignedDate = datetime
                    logs.message = `fieldExecutive Assigned (${checkfieldExecutive.fullName},by (${req.user.role} ,${req.user.fullName}))`;
                    assignFieldExecutive = await caseModel.findOneAndUpdate({ _id: req.body.caseId }, { $set: { fieldExecutiveId: req.body.fieldExecutiveId, fieldExecutive: fieldExecutive }, $push: { logs: logs } })
                }
                if (assignFieldExecutive) {
                    let fieldExecutiveToken = []
                    if (checkfieldExecutive.fireBaseToken) {
                        fieldExecutiveToken[0] = checkfieldExecutive.fireBaseToken
                        let data: any = {}
                        data._id = assignFieldExecutive._id;
                        data.date = assignFieldExecutive.date;
                        data.time = assignFieldExecutive.time;
                        data.fileNo = assignFieldExecutive.fileNo;
                        data.barCode = assignFieldExecutive.barCode;
                        data.applicantName = assignFieldExecutive.applicantName;
                        data.applicantType = assignFieldExecutive.applicantType;
                        data.officeName = assignFieldExecutive.officeName;
                        data.address = assignFieldExecutive.address;
                        data.pinCode = assignFieldExecutive.pinCode;
                        data.branch = assignFieldExecutive.branch;
                        data.area = assignFieldExecutive.area;
                        data.bank = assignFieldExecutive.bank;
                        data.product = assignFieldExecutive.product;
                        data.mobileNo = assignFieldExecutive.mobileNo;
                        data.duplicate = assignFieldExecutive.duplicate;
                        data.addressType = assignFieldExecutive.addressType;
                        let identify = "assigned"
                        let message = "New case assign to field-executive"
                        sendNotification(fieldExecutiveToken, message, data, identify)
                    }
                    return Messages.SUCCESS.UPDATED_SUCCESSFULLY
                } else {
                    return Messages.Failed.SOMETHING_WENT_WRONG
                }
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }
    //********   REVIEW CASE   **************************************************************************************************
    // ****supervisor review*******
    public async editReviewSupervisorCaseData(req: any, caseData: any) {
        let session;
        try {
            session = await mongoose.startSession();
            session.startTransaction();
            if ((caseData.stage === "supervisor" || caseData.duplicate === true) && caseData.stage !== 'submited') {
                let objectToBeUpdate: any = {};
                let updateCaseData;
                let logs: any = {};
                let datetime = getDateTime();
                if (req.body.resend == "resend") {

                    objectToBeUpdate = await validateReviewData(req, caseData);
                    if (objectToBeUpdate.code == 401) return objectToBeUpdate;

                    if (caseData.directSupervisor) objectToBeUpdate.directSupervisor = "";

                    let fieldExecutive: any = {}
                    objectToBeUpdate.fieldExecutive = fieldExecutive;
                    objectToBeUpdate.fieldExecutiveId = ""
                    objectToBeUpdate.acceptedBy = ""
                    let supervisor: any = {}
                    if (caseData.supervisorId) {
                        if (caseData.supervisor.name) {
                            supervisor.name = caseData.supervisor.name;
                        }
                        if (caseData.supervisor.assignedDate) {
                            supervisor.assignedDate = caseData.supervisor.assignedDate;
                        }
                    }

                    logs.message = `case resended by supervisor (${req.user.fullName}) to view upload cases on date ${moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss")}`;
                    updateCaseData = await caseModel.findOneAndUpdate({ _id: req.body.id }, { $set: { stage: "", status: "open", supervisor: supervisor }, $unset: objectToBeUpdate, $push: { logs: logs }, }, { session });

                    if (!updateCaseData) throw new Error("Case data has not been updated , Internal Error");

                    const deleteFeCase = await feSubmittedCasesModel.updateOne({ fieldExecutiveId: caseData.fieldExecutiveId, submittedCases: { $elemMatch: { caseId: caseData._id } } }, { $pull: { submittedCases: { caseId: caseData._id } } }, { session });

                    if (deleteFeCase.modifiedCount > 1) throw new Error("Internal issue in deleting case from fe table")
                    await session.commitTransaction();
                } else {
                    objectToBeUpdate = await validateReviewData(req, caseData);
                    if (objectToBeUpdate.code == 401) return objectToBeUpdate;

                    if (req.body.duplicate) return await submitDuplicateCase(req, objectToBeUpdate, caseData);


                    let supervisor = {
                        name: caseData.supervisor.name,
                        assignedDate: caseData.supervisor.assignedDate,
                        submittedDate: datetime
                    }
                    objectToBeUpdate.supervisor = supervisor
                    objectToBeUpdate.stage = "manager";
                    logs.messege = `case verified by Supervisor(${req.user.fullName}) on date ${moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss")} `;
                    updateCaseData = await caseModel.findOneAndUpdate({ _id: req.body.id }, { $set: objectToBeUpdate, $push: { logs: logs } }, { session });
                }
                if (updateCaseData) {
                    await session.commitTransaction();
                    return Messages.SUCCESS.UPDATED_SUCCESSFULLY;
                } else {
                    await session.abortTransaction();
                    return Messages.Failed.SOMETHING_WENT_WRONG;
                }
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG;
            }

        } catch (error) {
            if (session) await session.abortTransaction();
            error.code = 401
            return error
        } finally {
            if (session) session.endSession();
        }
    };

    // ******manager review********
    public async editReviewManagerCaseData(req: any, caseData: any) {
        let session;
        try {
            session = await mongoose.startSession();
            session.startTransaction();
            if ((caseData.stage === "manager" || caseData.stage === "senior-supervisor" || caseData.duplicate === true) && caseData.stage !== 'submited') {
                let objectToBeUpdate: any = {};
                let updateCaseData;
                let logs: any = {};
                let datetime = getDateTime();
                if (req.body.resend) {
                    objectToBeUpdate = await validateReviewData(req, caseData);

                    if (objectToBeUpdate.code == 401) return objectToBeUpdate;
                    if (caseData.directSupervisor) objectToBeUpdate.directSupervisor = ""

                    let fieldExecutive: any = {}
                    objectToBeUpdate.fieldExecutive = fieldExecutive
                    objectToBeUpdate.fieldExecutiveId = ""
                    objectToBeUpdate.acceptedBy = ""
                    let supervisor: any = {}
                    if (caseData.supervisorId) {
                        if (caseData.supervisor.name) {
                            supervisor.name = caseData.supervisor.name;
                        }
                        if (caseData.supervisor.assignedDate) {
                            supervisor.assignedDate = caseData.supervisor.assignedDate
                        }
                    };

                    logs.message = `case resended by manager(${req.user.fullName}) to view upload cases on date ${moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss")}`;

                    updateCaseData = await caseModel.findOneAndUpdate({ _id: req.body.id }, { $set: { stage: "", status: "open", supervisor: supervisor }, $unset: objectToBeUpdate, $push: { logs: logs }, }, { session });

                    if (!updateCaseData) throw new Error("Case data has not been updated , Internal Error");

                    const deleteFeCase = await feSubmittedCasesModel.updateOne({ fieldExecutiveId: caseData.fieldExecutiveId, submittedCases: { $elemMatch: { caseId: caseData._id } } }, { $pull: { submittedCases: { caseId: caseData._id } } }, { session });

                    if (deleteFeCase.modifiedCount > 1) throw new Error("Internal issue in deleting case from fe table")
                    await session.commitTransaction();

                } else {

                    objectToBeUpdate = await validateReviewData(req, caseData);
                    if (objectToBeUpdate.code == 401) {
                        return objectToBeUpdate;
                    }
                    if (req.body.duplicate) {
                        return await submitDuplicateCase(req, objectToBeUpdate, caseData)
                    }
                    let manager = {
                        name: caseData.manager.name,
                        assignedDate: caseData.manager.assignedDate,
                        submittedDate: datetime
                    }
                    objectToBeUpdate.manager = manager
                    objectToBeUpdate.stage = "submited";
                    objectToBeUpdate.status = "closed";
                    logs.messege = `case verified & submited by manager (${req.user.fullName}) on date ${moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss")} `;
                    updateCaseData = await caseModel.findOneAndUpdate({ _id: req.body.id }, { $set: objectToBeUpdate, $push: { logs: logs } }, { session });
                }
                if (updateCaseData) {
                    await session.commitTransaction();
                    return Messages.SUCCESS.UPDATED_SUCCESSFULLY;
                } else {
                    await session.abortTransaction();
                    return Messages.Failed.SOMETHING_WENT_WRONG;
                }
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG;
            }

        } catch (error) {
            if (session) await session.abortTransaction();
            error.code = 401
            return error
        } finally {
            if (session) session.endSession();
        }
    };

    // ******SeniorSupervisor review********
    public async editReviewSeniorSupervisorCaseData(req: any, caseData: any) {
        let session;
        try {
            session = await mongoose.startSession();
            session.startTransaction();
            if ((caseData.stage === "manager" || caseData.stage === "senior-supervisor" || caseData.duplicate === true) && caseData.stage !== 'submited') {
                let objectToBeUpdate: any = {};
                let updateCaseData;
                let logs: any = {};
                let datetime = getDateTime();
                if (req.body.resend) {
                    objectToBeUpdate = await validateReviewData(req, caseData);
                    if (objectToBeUpdate.code == 401) return objectToBeUpdate;

                    if (caseData.directSupervisor) objectToBeUpdate.directSupervisor = ""
                    let fieldExecutive: any = {}
                    objectToBeUpdate.fieldExecutive = fieldExecutive
                    objectToBeUpdate.fieldExecutiveId = ""
                    objectToBeUpdate.acceptedBy = ""
                    let supervisor: any = {}
                    if (caseData.supervisorId) {
                        if (caseData.supervisor.name) {
                            supervisor.name = caseData.supervisor.name;

                        }
                        if (caseData.supervisor.assignedDate) {
                            supervisor.assignedDate = caseData.supervisor.assignedDate
                        }
                    };

                    logs.message = `case resended by senior supervisor (${req.user.fullName}) to view upload cases on date ${moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss")}`;

                    updateCaseData = await caseModel.findOneAndUpdate({ _id: req.body.id }, { $set: { stage: "", status: "open", supervisor: supervisor }, $unset: objectToBeUpdate, $push: { logs: logs }, }, { session });

                    if (!updateCaseData) throw new Error("Case data has not been updated , Internal Error");

                    const deleteFeCase = await feSubmittedCasesModel.updateOne({ fieldExecutiveId: caseData.fieldExecutiveId, submittedCases: { $elemMatch: { caseId: caseData._id } } }, { $pull: { submittedCases: { caseId: caseData._id } } }, { session });

                    if (deleteFeCase.modifiedCount > 1) throw new Error("Internal issue in deleting case from fe table")
                    await session.commitTransaction();
                } else {

                    objectToBeUpdate = await validateReviewData(req, caseData);
                    if (objectToBeUpdate.code == 401) return objectToBeUpdate;

                    if (req.body.duplicate) return await submitDuplicateCase(req, objectToBeUpdate, caseData)

                    let seniorSupervisor = {
                        name: caseData.seniorSupervisor.name,
                        assignedDate: caseData.seniorSupervisor.assignedDate,
                        submittedDate: datetime
                    }
                    objectToBeUpdate.seniorSupervisor = seniorSupervisor
                    objectToBeUpdate.stage = "submited";
                    objectToBeUpdate.status = "closed";
                    logs.messege = `case verified by seniorSupervisor (${req.user.fullName}) on date ${moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss")} `;
                    updateCaseData = await caseModel.findOneAndUpdate({ _id: req.body.id }, { $set: objectToBeUpdate, $push: { logs: logs } }, { session });
                }
                if (updateCaseData) {
                    await session.commitTransaction();
                    return Messages.SUCCESS.UPDATED_SUCCESSFULLY;
                } else {
                    await session.abortTransaction();
                    return Messages.Failed.SOMETHING_WENT_WRONG;
                }
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG;
            }

        } catch (error) {
            if (session) await session.abortTransaction();
            error.code = 401
            return error
        } finally {
            if (session) session.endSession();
        }
    };

    // ******Admin review********
    public async editReviewAdminCaseData(req: any, caseData: any) {
        let session;
        try {
            session = await mongoose.startSession();
            session.startTransaction();
            if ((caseData.stage === "supervisor" || caseData.stage === "manager" || caseData.stage === "senior-supervisor" || caseData.duplicate === true) && caseData.stage !== 'submited') {
                let objectToBeUpdate: any = {};
                let updateCaseData;
                let logs: any = {};
                let datetime = getDateTime();
                if (req.body.resend) {
                    objectToBeUpdate = await validateReviewData(req, caseData);
                    if (objectToBeUpdate.code == 401) return objectToBeUpdate;

                    if (caseData.directSupervisor) objectToBeUpdate.directSupervisor = ""

                    let fieldExecutive: any = {}
                    objectToBeUpdate.fieldExecutive = fieldExecutive
                    let supervisor: any = {}
                    if (caseData.supervisorId) {
                        if (caseData.supervisor.name) {
                            supervisor.name = caseData.supervisor.name;
                        }
                        if (caseData.supervisor.assignedDate) {
                            supervisor.assignedDate = caseData.supervisor.assignedDate
                        }
                    }
                    objectToBeUpdate.fieldExecutiveId = ""
                    objectToBeUpdate.acceptedBy = ""
                    logs.message = `case resended by Admin (${req.user.fullName}) to view upload cases on date ${moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss")}`;

                    updateCaseData = await caseModel.findOneAndUpdate({ _id: req.body.id }, { $set: { stage: "", status: "open", supervisor: supervisor }, $unset: objectToBeUpdate, $push: { logs: logs } }, { session });

                    if (!updateCaseData) throw new Error("Case data has not been updated , Internal Error");

                    const deleteFeCase = await feSubmittedCasesModel.updateOne({ fieldExecutiveId: caseData.fieldExecutiveId, submittedCases: { $elemMatch: { caseId: caseData._id } } }, { $pull: { submittedCases: { caseId: caseData._id } } }, { session });

                    if (deleteFeCase.modifiedCount > 1) throw new Error("Internal issue in deleting case from fe table")
                    await session.commitTransaction();
                } else {
                    objectToBeUpdate = await validateReviewData(req, caseData);
                    if (objectToBeUpdate.code == 401) return objectToBeUpdate;

                    if (req.body.duplicate) return await submitDuplicateCase(req, objectToBeUpdate, caseData)

                    let admin = {
                        name: req.user.fullName,
                        submittedDate: datetime
                    }
                    objectToBeUpdate.admin = admin
                    objectToBeUpdate.stage = "submited";
                    objectToBeUpdate.status = "closed";
                    logs.messege = `case verified by Admin (${req.user.fullName}) on date ${moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss")} `;
                    updateCaseData = await caseModel.findOneAndUpdate({ _id: req.body.id }, { $set: objectToBeUpdate, $push: { logs: logs } }, { session });

                }
                if (updateCaseData) {
                    await session.commitTransaction();
                    return Messages.SUCCESS.UPDATED_SUCCESSFULLY;
                } else {
                    await session.abortTransaction();
                    return Messages.Failed.SOMETHING_WENT_WRONG;
                }
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG;
            }
        } catch (error) {
            if (session) await session.abortTransaction();
            error.code = 401
            return error
        } finally {
            if (session) session.endSession();
        }
    };

    // ************* Assigning Duplicate case ****************
    public async assignDuplicateCaseConfirmationData(req: any,) {
        try {
            let datetime = getDateTime();
            let logs: any = {}
            logs.message = `case sent to view uploaded case from duplicate case section by ${req.user.fullName}, ${moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss")}`

            let objectToBeUpdate = {
                cordinates: "",
                addressConfirm: "",
                addressConfirmByFieldExecutive: "",
                addressConfirmByFieldExecutiveRemarks: "",
                contactedPersonName: "",
                contactedPersonDesignation: "",
                applicantOccupation: "",
                workingFrom: "",
                premisesBusiness: "",
                premisesBusinessRemarks: "",
                areaType: "",
                businessBoard: "",
                businessBoardNameConfirmation: "",
                businessBoardNameRemarks: "",
                natureOfBusiness: "",
                natureOfBusinessRemarks: "",
                totalIncome: "",
                stockSeen: "",
                stock: "",
                businessActivitySeen: "",
                businessActivity: "",
                noOfEmployees: "",
                negativeProfile: "",
                negativeProfileRemarks: "",
                neighbourCheck1: "",
                neighbourCheck2: "",
                neighbourCheck1Remarks: "",
                neighbourCheck2Remarks: "",
                distance: "",
                applicantStayAddress: "",
                premisesResidence: "",
                premisesResidenceRemarks: "",
                staySinceSameAddress: "",
                documents: "",
                acceptedBy: "",
                staySinceSameAddressMonth: "",
                staySinceSameAddressYear: "",
                officeSetup: "",
                landMark: "",
                easeOfLocating: "",
                officeLocked: "",
                applicantStayAddressConfirm: "",
                applicantDesignation: "",
                applicantDesignationRemarks: "",
                remarks: "",
                caseStatus: "",
                caseStatusRemarks: "",
                agencyName: "",
                maritalStatus: "",
                isSpouseWorking: "",
                spouseWorkingPlace: "",
                spouseWorkingSince: "",
                spouseSalary: "",
                noOfFMember: "",
                noEarningMember: "",
                locationOfResi: "",
                typeOfResi: "",
                typeOfResiRemarks: "",
                areaLocality: "",
                houseArea: "",
                resiInterior: "",
                resiExterior: "",
                houseCondition: "",
                vehicle: "",
                vehicleRemarks: "",
                officeLock: "",
                applicantAge: "",
                contactedPersonDesignationRemarks: "",
                entryAllowed: "",
                nOfBR2: "",
                esg: "",
                imageAllowed: ""
            }
            let caseFind = await caseModel.findOneAndUpdate({ _id: req.query.id }, { $set: { duplicate: false }, $unset: objectToBeUpdate, $push: { logs: logs } })
            if (caseFind) {
                return Messages.SUCCESS.UPDATED_SUCCESSFULLY
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG;
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }

    // ****************************COPY CASE DATA ********************************************************
    public async copyCaseConfirmationData(req: any) {
        try {
            let datetime = getDateTime();
            let logs: any = {}
            let copyCase
            let caseFind: any = await caseModel.findOne({ _id: req.query.id2 }).lean();
            logs.message = `this case is copied from [file no:${caseFind.fileNo},mobile No:${caseFind.mobileNo}] by (${req.user.role})(${req.user.fullName})on date ${moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss")}]`
            delete caseFind._id;
            delete caseFind.date;
            delete caseFind.time;
            delete caseFind.fileNo;
            delete caseFind.barCode;
            delete caseFind.applicantName;
            delete caseFind.applicantType;
            // delete caseFind.addressType;
            delete caseFind.officeName;
            delete caseFind.stage;
            delete caseFind.status;
            delete caseFind.address;
            delete caseFind.pinCode;
            delete caseFind.branch;
            delete caseFind.area;
            delete caseFind.bank;
            delete caseFind.product;
            delete caseFind.managerId;
            delete caseFind.supervisorId;
            delete caseFind.seniorSupervisorId;
            delete caseFind.fieldExecutiveId;
            delete caseFind.acceptedBy;
            delete caseFind.parentId;
            delete caseFind.mobileNo; delete caseFind.logs; delete caseFind.duplicate;
            delete caseFind.admin; delete caseFind.supervisor; delete caseFind.seniorSupervisor; delete caseFind.manager; delete caseFind.fieldExecutive; delete caseFind.caseUploadTime; delete caseFind.created_at; delete caseFind.updated_at; delete caseFind.caseUploaded; delete caseFind.declinedBy;
            delete caseFind.directSupervisor; delete caseFind.dateVisit; delete caseFind.timeVisit;

            async function copyCaseData() {
                if (caseFind.addressConfirm) {
                    delete caseFind.addressType
                    caseFind.copyStatus = "copied"
                    copyCase = await caseModel.findOneAndUpdate({ _id: req.query.id1 }, { $set: caseFind, $push: { logs: logs } })
                    if (copyCase) {
                        return Messages.SUCCESS.UPDATED_SUCCESSFULLY
                    } else {
                        return Messages.Failed.CASE_NOT_FOUND
                    }
                } else {
                    return Messages.Failed.CASES.CASE_DATA_EMPTY
                }
            }
            if (caseFind) {
                switch (caseFind.addressType) {
                    case "BV":
                        if (req.query.addressType.trim().toUpperCase() == "BV") {
                            return await copyCaseData()
                        } else {
                            return Messages.Failed.CASES.ADDRESS_TYPE_NOT_MATCH
                        }
                    case "PV":
                        if (req.query.addressType.trim().toUpperCase() == "PV" || req.query.addressType.trim().toUpperCase() == "RV") {
                            return await copyCaseData()
                        } else {
                            return Messages.Failed.CASES.ADDRESS_TYPE_NOT_MATCH
                        }
                    case "RV":
                        if (req.query.addressType.trim().toUpperCase() == "PV" || req.query.addressType.trim().toUpperCase() == "RV") {
                            return await copyCaseData()
                        } else {
                            return Messages.Failed.CASES.ADDRESS_TYPE_NOT_MATCH
                        }
                }
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }
    public async downloadCaseData(req: any) {
        try {
            let x = []
            let condition = []
            condition.push({
                $match: {
                    _id: new mongoose.Types.ObjectId(`${req.params.id}`)
                }
            }, {
                $lookup: {
                    from: 'managers',
                    localField: 'managerId',
                    foreignField: '_id',
                    as: 'managerId'
                }
            }, {
                $lookup: {
                    from: 'fieldexecutives',
                    localField: 'fieldExecutiveId',
                    foreignField: '_id',
                    as: 'fieldExecutiveId'
                }
            })
            let caseData = await caseModel.aggregate(condition)
            if (caseData[0].documents) {
                for (let i = 0; i < caseData[0].documents.length; i++) {
                    x[i] = await this.Helper.getSignedUrlAWS(caseData[0].documents[i]);
                }
            }

            let createdExcelFile = await createExcelFile(caseData, x)
            if (createdExcelFile.code == 201) {
                return Messages.SUCCESS.UPDATED_SUCCESSFULLY
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG
            }
        } catch (error) {

            error.code = 401
            return error
        }
    }
    public async assignAllFeDataConfirmation(req: any) {
        try {
            let updateStatus = []
            let fieldExecutive: any = {}
            let logs: any = {};
            let datetime = getDateTime();
            var feIdArray = req.body.fieldExecutiveId.split(',');
            fieldExecutive.name = feIdArray[1]
            fieldExecutive.assignedDate = datetime
            logs.message = `fieldExecutive Assigned (${feIdArray[1]}), by (${req.user.role} ,${req.user.fullName}), dateTime (${moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss")})`;
            var caseIdArray = req.body.caseId[0].split(',');
            for (let i = 0; i < caseIdArray.length; i++) {
                let assignFieldExecutive: any = await caseModel.findOneAndUpdate({ _id: caseIdArray[i] }, { $set: { fieldExecutive: fieldExecutive, fieldExecutiveId: feIdArray[0] }, $push: { logs: logs } })
                if (assignFieldExecutive) {
                    let findFieldExecutive: any = await fieldExecutiveModel.findOne({ _id: feIdArray[0] })
                    let fieldExecutiveToken = []
                    if (findFieldExecutive.fireBaseToken) {
                        fieldExecutiveToken[0] = findFieldExecutive.fireBaseToken
                    } else {
                        fieldExecutiveToken = []
                    }
                    let message = "New case assigned to field-executive";
                    let identify = "assigned";
                    let data: any = {}
                    data._id = assignFieldExecutive._id;
                    data.date = assignFieldExecutive.date;
                    data.time = assignFieldExecutive.time;
                    data.fileNo = assignFieldExecutive.fileNo;
                    data.barCode = assignFieldExecutive.barCode;
                    data.applicantName = assignFieldExecutive.applicantName;
                    data.applicantType = assignFieldExecutive.applicantType;
                    data.officeName = assignFieldExecutive.officeName;
                    data.address = assignFieldExecutive.address;
                    data.pinCode = assignFieldExecutive.pinCode;
                    data.branch = assignFieldExecutive.branch;
                    data.area = assignFieldExecutive.area;
                    data.bank = assignFieldExecutive.bank;
                    data.product = assignFieldExecutive.product;
                    data.mobileNo = assignFieldExecutive.mobileNo;
                    data.duplicate = assignFieldExecutive.duplicate;
                    data.addressType = assignFieldExecutive.addressType;
                    await sendNotification(fieldExecutiveToken, message, data, identify)
                }
            }
            return Messages.SUCCESS.UPDATED_SUCCESSFULLY
            // let assignFieldExecutive: any = await caseModel.updateMany({ _id: { $in: caseIdArray } }, { $set: { fieldExecutive: fieldExecutive, fieldExecutiveId: feIdArray[0] }, $push: { logs: logs } })
            // if (assignFieldExecutive.modifiedCount > 0) {
            //     let findFieldExecutive = await fieldExecutiveModel.findOne({ _id: feIdArray[0] })
            //     let fieldExecutiveToken
            //     if (findFieldExecutive.fireBaseToken) {
            //         fieldExecutiveToken = findFieldExecutive.fireBaseToken
            //     } else {
            //         fieldExecutiveToken = []
            //     }
            //     let message = `${assignFieldExecutive.modifiedCount} New cases Assigned`;
            //     let identify = "assigned";
            //     await sendNotification(fieldExecutiveToken, message, identify)
            //     return Messages.SUCCESS.UPDATED_SUCCESSFULLY
            // } else {
            //     return Messages.Failed.CASES.MULTI_FE_ASSIGN
            // }
        } catch (error) {
            error.code = 401
            return error
        }
    }
    public async directToSupervisorDataConfirmation(req: any) {
        try {
            if (!req.query.sId || req.query.sId.length <= 0) {
                return Messages.Failed.CASES.SUPER_NOT_ASSIGNED
            }
            let logs: any = {};
            let datetime = getDateTime();
            logs.message = `case transfer directly to supervisor without field-executive on ${moment(datetime).utc().format("YYYY-MM-DD HH:mm:ss")} by ${req.user.role} (${req.user.fullName}) `;

            let updateCase = await caseModel.findOneAndUpdate({ _id: req.query.id }, { $set: { stage: "supervisor", status: "open", directSupervisor: true }, $push: { logs: logs } })
            if (updateCase) {
                return Messages.SUCCESS.UPDATED_SUCCESSFULLY
            } else {
                return Messages.Failed.CASES.CASE_NOT_FOUND
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }

    public async tatToExcelConfirmationData(req: any) {
        let addFile
        try {
            const { member, min, max } = req.body;
            const date1 = moment(min).format("YYYY/MM/DD");
            const date2 = moment(moment(max).format("YYYY/MM/DD")).add(1, "days").format("YYYY/MM/DD");
            const staticFileName = member === 'fieldExecutive' ? 'tat_excel_fe.xlsx' : 'tat_excel_other.xlsx'

            let fileUrl = path.join(__dirname, "../../public/tatFiles/");
            const fileName = `${member}_${Date.now()}.xlsx`
            const newFileUrl = `${fileUrl}tatDownloadableExcels/${fileName}`
            const databaseFileUrl = `/tatFiles/tatDownloadableExcels/${fileName}`
            addFile = await tatFileModel.create({ fileUrl: databaseFileUrl, status: 'processing', name: fileName })

            let workbook = new Excel.Workbook();
            await workbook.xlsx.readFile(`${fileUrl}${staticFileName}`).then(async function () {
                var worksheet = workbook.getWorksheet(1)
                let memberData: any;
                switch (member) {
                    case 'fieldExecutive':
                        memberData = await fieldExecutiveModel.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).select('_id fullName');
                        break;
                    case 'manager':
                        memberData = await managerModel.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).select('_id fullName');
                        break;
                    case 'seniorSupervisor':
                        memberData = await seniorSupervisorModel.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).select('_id fullName');
                        break;
                    case 'supervisor':
                        memberData = await supervisorModel.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).select('_id fullName');
                        break;
                    default:
                        break;
                }
                var row = worksheet.getRow(1);
                row.getCell(2).value = min
                row.getCell(6).value = max
                row.getCell(12).value = member
                for (let i = 0; i < memberData.length; i++) {
                    var row = worksheet.getRow(i + 3);
                    req.body.id = memberData[i]._id
                    const { one, two, three, four, five, six, seven, notSubmitted } = await calTat(req, date1, date2);
                    const total = one + two + three + four + five + six + seven + notSubmitted;
                    row.getCell(1).value = i + 1;
                    row.getCell(2).value = memberData[i].fullName;
                    row.getCell(3).value = one;
                    row.getCell(4).value = `${((one * 100) / (total === 0 ? 1 : total)).toFixed(2)}%`;
                    row.getCell(5).value = two;
                    row.getCell(6).value = `${((two * 100) / (total === 0 ? 1 : total)).toFixed(2)}%`;
                    row.getCell(7).value = three;
                    row.getCell(8).value = `${((three * 100) / (total === 0 ? 1 : total)).toFixed(2)}%`;
                    row.getCell(9).value = four;
                    row.getCell(10).value = `${((four * 100) / (total === 0 ? 1 : total)).toFixed(2)}%`;
                    row.getCell(11).value = five;
                    row.getCell(12).value = `${((five * 100) / (total === 0 ? 1 : total)).toFixed(2)}%`;
                    row.getCell(13).value = six;
                    row.getCell(14).value = `${((six * 100) / (total === 0 ? 1 : total)).toFixed(2)}%`;
                    row.getCell(15).value = seven;
                    row.getCell(16).value = `${((seven * 100) / (total === 0 ? 1 : total)).toFixed(2)}%`;
                    row.getCell(17).value = notSubmitted;
                    row.getCell(18).value = `${((notSubmitted * 100) / (total === 0 ? 1 : total)).toFixed(2)}%`;
                    row.getCell(19).value = total;
                }
                row.commit();
                await workbook.xlsx.writeFile(newFileUrl);

            })
            fs.access(newFileUrl, fs.constants.F_OK, async (err) => {
                if (err) {
                    await tatFileModel.updateOne({ _id: addFile._id }, { $set: { error: err.message, status: "failed" } })
                } else {
                    await tatFileModel.updateOne({ _id: addFile._id }, { $set: { status: "success" } })
                }
            });
        } catch (error) {
            await tatFileModel.updateOne({ _id: addFile._id }, { $set: { error: error.message, status: "failed" } })
            error.code = 401
            return error
        }
    }
}
export default caseService;
