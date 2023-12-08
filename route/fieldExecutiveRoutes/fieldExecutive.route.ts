import { Router } from "express";
import Route from "../../interfaces/route.interface";
import fieldExecutiveController from "../../controllers/fieldExecutiveController/fieldExecutive.controller";
import auth from "../../utils/verifyToken"
import upload from "../../utils/multer";




class fieldExecutiveRoute implements Route {
    public path = "/field-executive";
    public router = Router();
    public fieldExecutiveController = new fieldExecutiveController();



    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/addFieldExecutive`, auth, this.fieldExecutiveController.addFieldExecutive);
        this.router.post(`${this.path}/addFieldExecutiveData`, auth, upload.single('profilePic'), this.fieldExecutiveController.addFieldExecutiveData);
        this.router.get(`${this.path}/viewFieldExecutive`, auth, this.fieldExecutiveController.viewFieldExecutive);
        this.router.post(`${this.path}/viewFieldExecutiveDatatable`, auth, this.fieldExecutiveController.viewFieldExecutiveDatatable);
        this.router.get(`${this.path}/editFieldExecutive/:id`, auth, this.fieldExecutiveController.editFieldExecutive);
        this.router.post(`${this.path}/editFieldExecutive`, auth, upload.single('profilePic'), this.fieldExecutiveController.editFieldExecutiveData);
        this.router.get(`${this.path}/deleteFieldExecutive/:id`, auth, this.fieldExecutiveController.deleteFieldExecutive);
        this.router.post(`${this.path}/caseCount`, auth, this.fieldExecutiveController.caseCount);
        this.router.post(`${this.path}/distance`, auth, this.fieldExecutiveController.distance);
    }
}

export default fieldExecutiveRoute;