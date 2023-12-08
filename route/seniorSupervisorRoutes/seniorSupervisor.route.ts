import { Router } from "express";
import Route from "../../interfaces/route.interface";
import seniorSupervisorController from "../../controllers/seniorSupervisorController/seniorSupervisor.controller";
import auth from "../../utils/verifyToken"




class seniorSupervisorRoute implements Route {
    public path = "/senior-supervisor";
    public router = Router();
    public seniorSupervisorController = new seniorSupervisorController();



    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/addSeniorSupervisor`, auth, this.seniorSupervisorController.addSeniorSupervisor);
        this.router.post(`${this.path}/addSeniorSupervisorData`, auth, this.seniorSupervisorController.addSeniorSupervisorData);
        this.router.get(`${this.path}/viewSeniorSupervisor`, auth, this.seniorSupervisorController.viewSeniorSupervisor);
        this.router.post(`${this.path}/viewSeniorSupervisorDatatable`, auth, this.seniorSupervisorController.viewSeniorSupervisorDatatable);
        this.router.get(`${this.path}/editSeniorSupervisor/:id`, auth, this.seniorSupervisorController.editSeniorSupervisor);
        this.router.post(`${this.path}/editSeniorSupervisor`, auth, this.seniorSupervisorController.editSeniorSupervisorData);
        this.router.get(`${this.path}/deleteSeniorSupervisor/:id`, auth, this.seniorSupervisorController.deleteSeniorSupervisor);
        
        // *********** senior-supervisor allocations**************************************************
        this.router.get(`${this.path}/allocations`, auth, this.seniorSupervisorController.allocations);
        this.router.post(`${this.path}/viewSeniorSupervisorAllocationDatatable`, auth, this.seniorSupervisorController.viewSeniorSupervisorAllocationDatatable);
        this.router.get(`${this.path}/deleteSeniorSupervisorAllocation`, auth, this.seniorSupervisorController.deleteSeniorSupervisorAllocation);
        this.router.post(`${this.path}/deleteMultipleSeniorSupervisorAllocation`, auth, this.seniorSupervisorController.deleteMultipleSeniorSupervisorAllocation);
    }
}

export default seniorSupervisorRoute;