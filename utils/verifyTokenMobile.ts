import { Response, NextFunction } from "express";
import JWT, { TokenExpiredError } from "jsonwebtoken"
import errorResponseUnauth from "../helpers/response"
import fieldExecutiveModel from "@/models/fieldExecutive.model";
import config from "config"

let authMobile = async (req: any, res: Response, next: NextFunction) => {
    try {
        let roles: any
        const token = req.headers.authorization.split('Bearer ')[1];
        const apiVersion = req.headers["API-Version"] || req.headers["api-version"]
       
        if (!apiVersion) {
            const err = new Error('install new app')
            return errorResponseUnauth(res, err, 'install new app', 400)
        }
        if (apiVersion.toString().trim() !== '1.2.1') {
            const err = new Error('install new app')
            return errorResponseUnauth(res, err, 'install new app', 400)
        }
        JWT.verify(token, config.get("secretKey"), async (err: any, encoded: any) => {
            if (err) {
                return errorResponseUnauth(res, err, 'Invalid Token', 500)
            } else {
                let userData: any = await fieldExecutiveModel.findOne({ _id: encoded._id, isDeleted: { $exists: false } });
                if (userData) {
                    if (userData.token == req.headers.authorization.split('Bearer ')[1]) {
                        req.user = encoded;
                        req.user.role = "field-executive"
                        req.user.fullName = userData.fullName
                        req.user.email = userData.email
                        next();
                    } else {
                        const err = new Error('Invalid Token')
                        return errorResponseUnauth(res, err, 'Invalid Token', 500)
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

export default authMobile
