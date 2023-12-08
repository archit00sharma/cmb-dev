import express from "express";
import { Response, NextFunction } from "express";
import JWT, { TokenExpiredError } from "jsonwebtoken"
import adminModel from "../models/admin.model";
import managerModel from "../models/manager.model";
import seniorSupervisorModel from "../models/seniorSupervisors.model";
import supervisorModel from "../models/supervisors.model";
import errorResponseUnauth from "../helpers/response"
import fieldExecutiveModel from "@/models/fieldExecutive.model";


let auth = async (req: any, res: Response, next: NextFunction) => {
    try {
        let roles: any
        const token = req.cookies.jwtToken;
        JWT.verify(token, "6229d687MYNASIF4dc56229dHSDFFFBAbfdc543ca821de5b6543BDFSUDca821de5b52", async (err: any, encoded: any) => {
            if (err) {
                return errorResponseUnauth(res, err, 'Invalid Token', 500)
            } else {
                if (encoded.role == "admin") {
                    roles = adminModel
                }
                else if (encoded.role == "manager") {
                    roles = managerModel
                } else if (encoded.role == "senior-supervisor") {
                    roles = seniorSupervisorModel
                } else if (encoded.role == "supervisor") {
                    roles = supervisorModel
                } else if (encoded.role == "field-executive") {
                    roles = fieldExecutiveModel
                }

                let userData = await roles.findOne({ _id: encoded._id, isDeleted: { $exists: false } });

                if (userData) {
                    if (userData.token && (userData.token === token)) {
                        req.user = encoded;
                        req.user.fullName = userData.fullName;
                        req.user.email = userData.email;
                        req.user.permissions =  userData.permissions;
                        next();
                    } else {
                        const err = 'Token Not Found'
                        return errorResponseUnauth(res, err, 'Kindly Login Again', 500)
                    }
                } else {
                    const err = new Error('Invalid Token')
                    return errorResponseUnauth(res, err, 'Invalid Token', 500)
                }
            }
        });
    } catch (error: any) {
        const err = new Error(error)
        return errorResponseUnauth(res, err, 'Token required', 500)
    }
}

export default auth
