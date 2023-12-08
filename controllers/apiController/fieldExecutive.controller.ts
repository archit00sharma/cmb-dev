import { Console } from "console";
import { NextFunction, Request, Response } from "express";
import apiFieldExecutiveService from "../../services/apiServices/fieldExecutive.service"




class apiFieldExecutiveController {
    public apiFieldExecutiveService = new apiFieldExecutiveService();

    public login = async (req: any, res: Response, next: NextFunction) => {
        try {
            const login: any = await this.apiFieldExecutiveService.login(req, res);
            res.status(login.code).send(login)
        } catch (error) { next(error) }

    };
    public assignCases = async (req: any, res: Response, next: NextFunction) => {
        try {
            const assignCasesDataConfirmation: any = await this.apiFieldExecutiveService.assignCasesData(req, res);
            res.status(assignCasesDataConfirmation.code).send(assignCasesDataConfirmation)
        } catch (error) { next(error) }
    };
    public acceptOrRejectCase = async (req: any, res: Response, next: NextFunction) => {
        try {
            const acceptOrRejectCaseDataConfirmation: any = await this.apiFieldExecutiveService.acceptOrRejectCaseData(req, res);
            res.status(acceptOrRejectCaseDataConfirmation.code).send(acceptOrRejectCaseDataConfirmation)
        } catch (error) { next(error) }

    };
    public myCases = async (req: any, res: Response, next: NextFunction) => {
        try {
            const myCasesDataConfirmation: any = await this.apiFieldExecutiveService.myCasesData(req, res);
            res.status(myCasesDataConfirmation.code).send(myCasesDataConfirmation)
        } catch (error) { next(error) }
    }
    public dayStartEnd = async (req: any, res: Response, next: NextFunction) => {
        try {
            const dayStartEndDataConfirmation: any = await this.apiFieldExecutiveService.dayStartEndData(req, res);
            res.status(dayStartEndDataConfirmation.code).send(dayStartEndDataConfirmation)
        } catch (error) {
            next(error)
        }
    };
    public formData = async (req: any, res: Response, next: NextFunction) => {
        try {
            const formDataConfirmation: any = await this.apiFieldExecutiveService.formData(req, res);
            res.status(formDataConfirmation.code).send(formDataConfirmation)
        } catch (error) {
            next(error)
        }
    };
    public submitedCases = async (req: any, res: Response, next: NextFunction) => {
        try {
            const submitedCasesDataConfirmation: any = await this.apiFieldExecutiveService.submitedCases(req, res);
            res.status(submitedCasesDataConfirmation.code).send(submitedCasesDataConfirmation)
        } catch (error) {
            next(error)
        }
    };
    public logout = async (req: any, res: Response, next: NextFunction) => {
        try {
            const logoutDataConfirmation: any = await this.apiFieldExecutiveService.logoutData(req, res);
            res.status(logoutDataConfirmation.code).send(logoutDataConfirmation)
        } catch (error) {
            next(error)
        }
    };


}

export default apiFieldExecutiveController;