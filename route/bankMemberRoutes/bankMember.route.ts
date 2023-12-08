import { Router } from "express";
import Route from "../../interfaces/route.interface";
import bankMemberController from "../../controllers/bankMemberController/bankMember.controller";
import auth from "../../utils/verifyToken"




class bankMemberRoute implements Route {
    public path = "/bankMember";
    public router = Router();
    public bankMemberController = new bankMemberController();



    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/addBankMember`, auth, this.bankMemberController.addBankMember);
        this.router.post(`${this.path}/addBankMemberData`, auth, this.bankMemberController.addBankMemberData);
        this.router.get(`${this.path}/viewBankMember`, auth, this.bankMemberController.viewBankMember);
        this.router.get(`${this.path}/editBankMember/:id`, auth, this.bankMemberController.editBankMember);
        this.router.post(`${this.path}/editBankMember`, auth, this.bankMemberController.editBankMemberData);
        this.router.post(`${this.path}/viewBankMemberDatatable`, auth, this.bankMemberController.viewBankMemberDatatable);
        this.router.get(`${this.path}/deleteBankMember/:id`, auth, this.bankMemberController.deleteBankMember);
        

        // *********** bankMember allocations**************************************************
        this.router.get(`${this.path}/allocations`, auth, this.bankMemberController.allocations);
        this.router.post(`${this.path}/viewBankMemberAllocationDatatable`, auth, this.bankMemberController.viewBankMemberAllocationDatatable);
        this.router.get(`${this.path}/deleteBankMemberAllocation`, auth, this.bankMemberController.deleteBankMemberAllocation);
        this.router.post(`${this.path}/deleteMultipleBankMemberAllocation`, auth, this.bankMemberController.deleteMultipleBankMemberAllocation);
    }
}

export default bankMemberRoute;