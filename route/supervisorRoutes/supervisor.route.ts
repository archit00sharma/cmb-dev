import { Router } from "express";
import Route from "../../interfaces/route.interface";
import supervisorController from "../../controllers/supervisorController/supervisor.controller";
import auth from "../../utils/verifyToken"




class supervisorRoute implements Route {
    public path = "/supervisor";
    public router = Router();
    public supervisorController = new supervisorController();



    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/addSupervisor`, auth, this.supervisorController.addSupervisor);
        this.router.post(`${this.path}/addSupervisorData`, auth, this.supervisorController.addSupervisorData);
        this.router.get(`${this.path}/viewSupervisor`, auth, this.supervisorController.viewSupervisor);
        this.router.post(`${this.path}/viewSupervisorDatatable`, auth, this.supervisorController.viewSupervisorDatatable);
        this.router.get(`${this.path}/editSupervisor/:id`, auth, this.supervisorController.editSupervisor);
        this.router.post(`${this.path}/editSupervisor`, auth, this.supervisorController.editSupervisorData);
        this.router.get(`${this.path}/deleteSupervisor/:id`, auth, this.supervisorController.deleteSupervisor);
        
        // *********** supervisor allocations**************************************************
        this.router.get(`${this.path}/allocations`, auth, this.supervisorController.allocations);
        this.router.post(`${this.path}/viewSupervisorAllocationDatatable`, auth, this.supervisorController.viewSupervisorAllocationDatatable);
        this.router.get(`${this.path}/deleteSupervisorAllocation`, auth, this.supervisorController.deleteSupervisorAllocation);
        this.router.post(`${this.path}/deleteMultipleSupervisorAllocation`, auth, this.supervisorController.deleteMultipleSupervisorAllocation);
    }
}

export default supervisorRoute;