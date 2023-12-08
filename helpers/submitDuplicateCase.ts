import { Response, Router } from "express";
import Messages from "messages"
import getDateTime from "@/helpers/getCurrentDateTime";
import caseModel from "@/models/case.model"

let submitDuplicateCase = async (req: any, objectToBeUpdate: any, caseData: any) => {
    try {
       
        let datetime = getDateTime();
        let admin: any = {}
        let manager: any = {}
        let supervisor: any = {}
        let seniorSupervisor: any = {}
        let logs: any = {};
        logs.message = `duplicate case submited by ${req.user.role},[NAME:${req.user.fullName}],${datetime}`;
        if (req.user.role == "admin") {
            admin.name = req.user.fullName
            admin.submittedDate = datetime
            objectToBeUpdate.admin = admin
        }
        if (req.user.role == "manager") {
            manager.name = req.user.fullName
            manager.assignedDate = caseData.manager.assignedDate
            manager.submittedDate = datetime
            objectToBeUpdate.manager = manager
        }
        if (req.user.role == "senior-supervisor") {
            seniorSupervisor.name = req.user.fullName
            seniorSupervisor.assignedDate = caseData.seniorSupervisor.assignedDate
            seniorSupervisor.submittedDate = datetime
            objectToBeUpdate.seniorSupervisor = seniorSupervisor
        }
        if (req.user.role == "supervisor") {
            supervisor.name = req.user.fullName
            supervisor.assignedDate = caseData.supervisor.assignedDate
            supervisor.submittedDate = datetime
            objectToBeUpdate.supervisor = supervisor
        }
        objectToBeUpdate.stage = "submited";
        objectToBeUpdate.status = "closed";
        objectToBeUpdate.duplicate = false
        let updateCase = await caseModel.findOneAndUpdate({ _id: req.body.id }, { $set: objectToBeUpdate, $push: { logs: logs } })
        if (updateCase) {
            return Messages.SUCCESS.UPDATED_SUCCESSFULLY
        } else {
            return Messages.Failed.CASES.CASE_NOT_FOUND
        }
    }
    catch (error) {
   
        error.code = 401
        return error
    }
}
export default submitDuplicateCase