import bcrypt from "bcrypt";
import adminModel from "../../models/admin.model";
import managerModel from "../../models/manager.model";
import seniorSupervisorModel from "../../models/seniorSupervisors.model";
import supervisorModel from "../../models/supervisors.model";
import caseModel from "@/models/case.model";
import Messages from "../../messages"
import userAllocationModel from "@/models/userAllocations.model";

class supervisorService {

    public async addSupervisorData(req: any) {
        try {
            let count: number = 0
            let addMember: any
            let arrayFields: any = [];


            let model: any
            switch (req.user.role) {
                case "admin":
                    model = adminModel;
                    break;
                case "manager":
                    model = managerModel;
                    break;
                case "senior-supervisor":
                    model = seniorSupervisorModel;
                    break;
                default:
                    return Messages.Failed.PERMISSION_DENIED
            }
            if (req.body.addMember == "supervisor") {
                const findAddedBy: any = await model.findOne({ _id: req.user._id })
                if (findAddedBy) {
                    if (findAddedBy.permissions.includes("supervisor")) {
                        const checkPersonToBeAdded = await supervisorModel.findOne({ email: req.body.email })
                        if (!checkPersonToBeAdded) {
                            async function hashPassword() {
                                const password = req.body.password
                                const saltRounds = 10;
                                const hashed = await new Promise((resolve, reject) => {
                                    bcrypt.hash(password, saltRounds, function (err, hash) {
                                        if (err) reject(err)
                                        resolve(hash)
                                    });
                                })
                                return hashed
                            }
                            let hash = req.body.password.length > 0 ? await hashPassword() : ""

                            let objToBeCreated: any = {
                                fullName: req.body.name.replaceAll(",", "").replaceAll("@", ""),
                                email: req.body.email,
                                addedBy: req.user.role,
                            }

                            if (req.body.password.length > 0) {
                                objToBeCreated.password = hash
                            }
                            if (req.body.permissions != undefined && req.body.permissions.length > 0) {
                                objToBeCreated.permissions = req.body.permissions
                            }

                            addMember = await supervisorModel.create(objToBeCreated)

                            if (req.body.area && req.body.area.length > 0) {
                                for (let a = 0; a < req.body.area.length; a++) {
                                    for (let i = 0; i < req.body.area[a].length; i++) {
                                        for (let j = 0; j < req.body.bank[a].length; j++) {
                                            for (let k = 0; k < req.body.product[a].length; k++) {
                                                arrayFields.push({ area: req.body.area[a][i], product: req.body.product[a][k], bank: req.body.bank[a][j], role: "supervisor", user_id: addMember._id })
                                            }
                                        }
                                    }
                                }
                            }
                            const set = new Set(arrayFields.map(JSON.stringify));
                            const hasDuplicates = set.size < arrayFields.length;
                            if (hasDuplicates === true) { return Messages.Failed.DUPLICATE_AREA_PRODUCT_BANK }


                            if (arrayFields.length > 0 && addMember) await userAllocationModel.insertMany(arrayFields)


                            if (addMember) {
                                return Messages.SUCCESS.ADDED_SUCCESSFULLY
                            } else {
                                return Messages.Failed.SOMETHING_WENT_WRONG
                            }
                        } else {
                            return Messages.Failed.EMAIL_ID_ALREADY_EXISTS
                        }
                    } else {
                        return Messages.Failed.INVALID_PERMISSIONS_GRANTED
                    }

                } else {
                    return Messages.Failed.PERMISSION_DENIED
                }
            } else {
                return Messages.Failed.PERMISSION_DENIED
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }
    public async editSupervisorData(req: any) {
        try {


            let findSupervisor = await supervisorModel.findOne({ _id: req.body.id })
            async function validateCase() {
                let caseFind = await caseModel.findOne({ supervisorId: findSupervisor._id, status: "open" })
                if (caseFind) {
                    return Messages.Failed.EDIT_FAILED
                } else {
                    return true
                }
            }
            let arrayFields: any = [];
            if (req.body.area && req.body.area.length > 0) {
                for (let a = 0; a < req.body.area.length; a++) {
                    for (let i = 0; i < req.body.area[a].length; i++) {
                        for (let j = 0; j < req.body.bank[a].length; j++) {
                            for (let k = 0; k < req.body.product[a].length; k++) {
                                arrayFields.push({ area: req.body.area[a][i], product: req.body.product[a][k], bank: req.body.bank[a][j], role: "supervisor", user_id: findSupervisor._id })
                            }
                        }
                    }
                }
            }

            const set = new Set(arrayFields.map(JSON.stringify));
            const hasDuplicates = set.size < arrayFields.length;
            if (hasDuplicates === true) { return Messages.Failed.DUPLICATE_AREA_PRODUCT_BANK }


            if (req.body.name.trim() != findSupervisor.fullName) {
                let z = await validateCase()
                if (z != true) {
                    return z
                }
            }
            if (req.body.email.trim() != findSupervisor.email) {
                let z = await validateCase()
                if (z != true) {
                    return z
                }
            }

            async function hashPassword() {
                const password = req.body.password
                const saltRounds = 10;
                const hashed = await new Promise((resolve, reject) => {
                    bcrypt.hash(password, saltRounds, function (err, hash) {
                        if (err) reject(err)
                        resolve(hash)
                    });
                })
                return hashed
            }
            let hash = req.body.password.length > 0 ? await hashPassword() : "";
            let objToBeCreated: any = {
                fullName: req.body.name.replaceAll(",", "").replaceAll("@", ""),
                email: req.body.email,
                addedBy: req.user.role,
            };

            if (arrayFields.length > 0) {
                await userAllocationModel.insertMany(arrayFields)
            }


            if (req.body.password.length > 0) {
                objToBeCreated.password = hash;
            }
            if (
                req.body.permissions != undefined &&
                req.body.permissions.length > 0
            ) {
                objToBeCreated.permissions = req.body.permissions;
            } else {
                objToBeCreated.permissions = []
            }
            let supervisorData = await supervisorModel.findOneAndUpdate({ _id: req.body.id }, {
                $set: objToBeCreated
            })
            if (supervisorData) {
                return Messages.SUCCESS.UPDATED_SUCCESSFULLY
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG
            }
        } catch (error) {
            error.code = 401
            return error
        }
    }
    public async deleteSupervisorData(req: any) {
        try {
            let caseFind = await caseModel.findOne({ supervisorId: req.params.id, status: "open" })
            if (caseFind) {
                return Messages.Failed.EDIT_FAILED
            } else {
                await userAllocationModel.deleteMany({ role: 'supervisor', user_id: req.params.id })
                const deleteSupervisor = await supervisorModel.findOneAndUpdate({ _id: req.params.id }, { $set: { isDeleted: true, supervisorFields: [] } });
                if (deleteSupervisor) {
                    return Messages.SUCCESS.DELETED_SUCCESSFULLY;
                } else {
                    return Messages.Failed.SOMETHING_WENT_WRONG;
                }
            }
        } catch (error) {
            error.code = 401
            return error
        }

    }
}
export default supervisorService;
