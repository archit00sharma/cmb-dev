import { Router } from "express";
import Route from "../../interfaces/route.interface";
import managerController from "../../controllers/managerController/manager.controller";
import auth from "../../utils/verifyToken"




class managerRoute implements Route {
    public path = "/manager";
    public router = Router();
    public managerController = new managerController();



    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/addManager`, auth, this.managerController.addManager);
        this.router.post(`${this.path}/addManagerData`, auth, this.managerController.addManagerData);
        this.router.get(`${this.path}/viewManager`, auth, this.managerController.viewManager);
        this.router.get(`${this.path}/editManager/:id`, auth, this.managerController.editManager);
        this.router.post(`${this.path}/editManager`, auth, this.managerController.editManagerData);
        this.router.post(`${this.path}/viewManagerDatatable`, auth, this.managerController.viewManagerDatatable);
        this.router.get(`${this.path}/deleteManager/:id`, auth, this.managerController.deleteManager);
        

        // *********** manager allocations**************************************************
        this.router.get(`${this.path}/allocations`, auth, this.managerController.allocations);
        this.router.post(`${this.path}/viewManagerAllocationDatatable`, auth, this.managerController.viewManagerAllocationDatatable);
        this.router.get(`${this.path}/deleteManagerAllocation`, auth, this.managerController.deleteManagerAllocation);
        this.router.post(`${this.path}/deleteMultipleManagerAllocation`, auth, this.managerController.deleteMultipleManagerAllocation);
    }
}

export default managerRoute;