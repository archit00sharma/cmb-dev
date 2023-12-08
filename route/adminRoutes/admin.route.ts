import { Router } from "express";
import Route from "../../interfaces/route.interface";
import adminController from "../../controllers/adminController/admin.controller";
import auth from "../../utils/verifyToken"
import upload from "../../utils/multer";




class adminRoute implements Route {
    public path = "/admin";
    public router = Router();
    public adminController = new adminController();



    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/profile`, auth, this.adminController.profile);
        this.router.post(`${this.path}/profile`, auth, this.adminController.profileData);


        this.router.get(`${this.path}/addProduct`, auth, this.adminController.addProduct);
        this.router.post(`${this.path}/addProductData`, auth, this.adminController.addProductData);
        this.router.get(`${this.path}/viewProduct`, auth, this.adminController.viewProduct);
        this.router.get(`${this.path}/editProduct/:id`, auth, this.adminController.editProduct);
        this.router.post(`${this.path}/editProduct`, auth, this.adminController.editProductData);
        this.router.post(`${this.path}/viewProductDatatable`, auth, this.adminController.viewProductDatatable);
        this.router.get(`${this.path}/deleteProduct/:id`, auth, this.adminController.deleteProduct);


        this.router.get(`${this.path}/addBank`, auth, this.adminController.addBank);
        this.router.post(`${this.path}/addBankData`, auth, this.adminController.addBankData);
        this.router.get(`${this.path}/viewBank`, auth, this.adminController.viewBank);
        this.router.get(`${this.path}/editBank/:id`, auth, this.adminController.editBank);
        this.router.post(`${this.path}/editBank`, auth, this.adminController.editBankData);
        this.router.post(`${this.path}/viewBankDatatable`, auth, this.adminController.viewBankDatatable);
        this.router.get(`${this.path}/deleteBank/:id`, auth, this.adminController.deleteBank);



        this.router.get(`${this.path}/addArea`, auth, this.adminController.addArea);
        this.router.post(`${this.path}/addAreaData`, auth, this.adminController.addAreaData);
        this.router.get(`${this.path}/viewArea`, auth, this.adminController.viewArea);
        this.router.get(`${this.path}/editArea/:id`, auth, this.adminController.editArea);
        this.router.post(`${this.path}/editArea`, auth, this.adminController.editAreaData);
        this.router.post(`${this.path}/viewAreaDatatable`, auth, this.adminController.viewAreaDatatable);
        this.router.get(`${this.path}/deleteArea/:id`, auth, this.adminController.deleteArea);
        this.router.post(`${this.path}/checkPassword`, auth, this.adminController.checkPassword);



        this.router.get(`${this.path}/viewTatFiles`, auth, this.adminController.viewTatFiles);
        this.router.post(`${this.path}/viewTatFilesDatatable`, auth, this.adminController.viewTatFilesDatatable);
        this.router.get(`${this.path}/deleteTatFile/:id`, auth, this.adminController.deleteTatFile);


        this.router.get(`${this.path}/feCaseHistory`, auth, this.adminController.feCaseHistory);
        this.router.post(`${this.path}/viewFeCaseHistory`, auth, this.adminController.viewFeCaseHistory);
        this.router.post(`${this.path}/feCaseHistoryDatatable`, auth, this.adminController.feCaseHistoryDatatable);
    

    }
}

export default adminRoute;