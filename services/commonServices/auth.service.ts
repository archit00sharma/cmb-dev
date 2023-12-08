import bcrypt from "bcrypt";
import adminModel from "../../models/admin.model";
import managerModel from "../../models/manager.model";
import seniorSupervisorModel from "../../models/seniorSupervisors.model";
import supervisorModel from "../../models/supervisors.model";
import JWT from "jsonwebtoken"
import { loginDto } from "../../dtos/login.dto";
import * as EmailValidator from 'email-validator';
import Messages from "../../messages";


class authService {
    public async logIn(loginData: loginDto, res: any, req: any) {
        try {
            let findUser: any
            let roles: any
            if (!loginData.email || !loginData.password) {
                return Messages.Failed.EMAIL_PASSWORD_MISSING
            }
            else {
                const emailVerify = EmailValidator.validate(loginData.email);
                if (emailVerify) {
                    switch (loginData.role) {
                        case "admin":
                            findUser = await adminModel.findOne({ email: loginData.email, isDeleted: { $exists: false } })
                            roles = adminModel
                            break;
                        case "manager":
                            findUser = await managerModel.findOne({ email: loginData.email, isDeleted: { $exists: false } })
                            roles = managerModel
                            break;
                        case "senior-supervisor":
                            findUser = await seniorSupervisorModel.findOne({ email: loginData.email, isDeleted: { $exists: false } })
                            roles = seniorSupervisorModel
                            break;
                        case "supervisor":
                            findUser = await supervisorModel.findOne({ email: loginData.email, isDeleted: { $exists: false } })
                            roles = supervisorModel
                            break;
                        default:
                            return Messages.Failed.INVALID_ROLE;

                    }
                    if (findUser) {
                        async function checkUser(password: any) {
                            const match = await bcrypt.compare(password, findUser.password);
                            if (match) {
                                let token = JWT.sign({ _id: findUser._id.toString(), email: loginData.email, role: loginData.role, fullName: findUser.fullName }, "6229d687MYNASIF4dc56229dHSDFFFBAbfdc543ca821de5b6543BDFSUDca821de5b52");
                                res.cookie("jwtToken", token, {
                                    expires: new Date(Date.now() + 28592000000),
                                    httpOnly: true
                                })

                                const cond = (req.body.fireBaseToken && req.body.fireBaseToken.length > 0) ? { $set: { token: token }, $addToSet: { fireBaseToken: req.body.fireBaseToken } } : { $set: { token: token } }

                                const addToken = await roles.findOneAndUpdate({ _id: findUser._id }, cond)

                                return Messages.SUCCESS.LOGGED_IN
                            } else {

                                return Messages.Failed.INVALID_PASSWORD
                            }
                        }
                        return checkUser(loginData.password)
                    } else {
                        return Messages.Failed.USER_NOT_REGISTERED
                    }
                } else {
                    return Messages.Failed.INVALID_EMAIL_ID
                }
            }
        } catch (error) {
            error.code = 401
            return error
        }

    }

}

export default authService;
