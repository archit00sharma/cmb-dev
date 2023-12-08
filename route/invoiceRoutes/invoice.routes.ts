import { Router } from "express";
import Route from "../../interfaces/route.interface";
import invoiceController from "../../controllers/invoiceController/invoice.controller";
import auth from "../../utils/verifyToken";
import { validate, schemas } from '../../helpers/joi/joi';




class invoiceRoute implements Route {
    public path = "/invoice";
    public router = Router();
    public invoiceController = new invoiceController();



    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // ****************  invoice from code    *******************************************
        this.router.get(`${this.path}/invoiceFromList`, validate(schemas.getInvoiceFromList), auth, this.invoiceController.invoiceFromList);
        this.router.post(`${this.path}/invoiceFromDataTable`,validate(schemas.postInvoiceFromDataTable), auth, this.invoiceController.invoiceFromDataTable);
        this.router.get(`${this.path}/addInvoiceFrom`,validate(schemas.getAddInvoiceFrom), auth, this.invoiceController.addInvoiceFrom);
        this.router.post(`${this.path}/submitAddInvoiceFrom`, validate(schemas.postSubmitAddInvoiceFrom), auth, this.invoiceController.submitAddInvoiceFrom);
        this.router.get(`${this.path}/editInvoiceFrom/:id`, auth, this.invoiceController.editInvoiceFrom);
        this.router.post(`${this.path}/submitEditInvoiceFrom/:id`, validate(schemas.postSubmitEditInvoiceFrom), auth, this.invoiceController.submitEditInvoiceFrom);
        this.router.get(`${this.path}/deleteInvoiceFrom/:id`, validate(schemas.getDeleteInvoiceFrom), auth, this.invoiceController.deleteInvoiceFrom);

        // ****************************** invoice to code **************************************
        this.router.get(`${this.path}/invoiceToList`, auth, this.invoiceController.invoiceToList);
        this.router.post(`${this.path}/invoiceToDataTable`, auth, this.invoiceController.invoiceToDataTable);
        this.router.get(`${this.path}/addInvoiceTo`, auth, this.invoiceController.addInvoiceTo);
        this.router.post(`${this.path}/submitAddInvoiceTo`, validate(schemas.postSubmitAddInvoiceTo), auth, this.invoiceController.submitAddInvoiceTo);
        this.router.get(`${this.path}/editInvoiceTo/:id`, auth, this.invoiceController.editInvoiceTo);
        this.router.post(`${this.path}/submitEditInvoiceTo/:id`, validate(schemas.postSubmitEditInvoiceTo), auth, this.invoiceController.submitEditInvoiceTo);
        this.router.get(`${this.path}/deleteInvoiceTo/:id`, validate(schemas.getDeleteInvoiceTo), auth, this.invoiceController.deleteInvoiceTo);

        // ************************ BANK DETAILS ************************************************
        this.router.get(`${this.path}/bankDetailsList`, auth, this.invoiceController.bankDetailsList);
        this.router.post(`${this.path}/bankDetailsDataTable`, auth, this.invoiceController.bankDetailsDataTable);
        this.router.get(`${this.path}/addBankDetails`, auth, this.invoiceController.addBankDetails);
        this.router.get(`${this.path}/editBankDetails/:id`, auth, this.invoiceController.editBankDetails);
        this.router.post(`${this.path}/submitEditBankDetails/:id`, validate(schemas.postSubmitEditBankDetails), auth, this.invoiceController.submitEditBankDetails);
        this.router.post(`${this.path}/submitAddBankDetails`, validate(schemas.postSubmitAddBankDetails), auth, this.invoiceController.submitAddBankDetails);
        this.router.get(`${this.path}/deleteBankDetails/:id`, validate(schemas.getDeleteBankDetails), auth, this.invoiceController.deleteBankDetails);

        // ********************** INVOICE RATE CRUD********************************************
        this.router.get(`${this.path}/rateList`, auth, this.invoiceController.rateList);
        this.router.post(`${this.path}/rateListDataTable`, auth, this.invoiceController.rateListDataTable);
        this.router.post(`${this.path}/addRate`, validate(schemas.postAddRate), auth, this.invoiceController.addRate);
        this.router.post(`${this.path}/editRate/:id`, validate(schemas.postEditRate), auth, this.invoiceController.editRate);
        this.router.get(`${this.path}/deleteRate/:id`, validate(schemas.getDeleteRate), auth, this.invoiceController.deleteRate);

        // ************************** INVOICE CRUD **************************************

        // ******************* invoice table ***********************************
        this.router.get(`${this.path}/invoiceList`, auth, this.invoiceController.invoiceList);
        this.router.post(`${this.path}/invoiceListDataTable`, auth, this.invoiceController.invoiceListDataTable);
        this.router.get(`${this.path}/addInvoice`, auth, this.invoiceController.addInvoice);
        this.router.post(`${this.path}/addInvoiceSubmit`, validate(schemas.postAddInvoiceSubmit), auth, this.invoiceController.addInvoiceSubmit);

        // ************** invoice excel status table *************************************
        this.router.get(`${this.path}/invoiceExcelDataStatus`, auth, this.invoiceController.invoiceExcelDataStatus);
        this.router.post(`${this.path}/invoiceExcelDataStatusDataTable`, auth, this.invoiceController.invoiceExcelDataStatusDataTable);
        this.router.get(`${this.path}/deleteInvoiceExcelDataStatus/:id/:uniqueId`, auth, this.invoiceController.deleteInvoiceExcelDataStatus);

        // ************************ invoice excel data table *********************
        this.router.get(`${this.path}/invoiceExcelData/:id/:invoiceExcelFormat/:conveyance?`, auth, this.invoiceController.invoiceExcelData);
        this.router.post(`${this.path}/invoiceExcelDataDataTable`, auth, this.invoiceController.invoiceExcelDataDataTable);
        this.router.post(`${this.path}/editInvoiceExcelData/:id`, auth, this.invoiceController.editInvoiceExcelData);
        this.router.get(`${this.path}/deleteInvoiceExcelData/:id/:uniqueId/:excelFormat`, auth, this.invoiceController.deleteInvoiceExcelData);


        // ************************ invoice excel data excel table *********************
        this.router.get(`${this.path}/createInvoiceDataExcel/:invoiceExcelFormat/:uniqueId`, auth, this.invoiceController.createInvoiceDataExcel);
        this.router.get(`${this.path}/invoiceDataExcelStatus`, auth, this.invoiceController.invoiceDataExcelStatus);
        this.router.post(`${this.path}/invoiceDataExcelStatusDataTable`, auth, this.invoiceController.invoiceDataExcelStatusDataTable);
        this.router.get(`${this.path}/deleteInvoiceExcelFile/:id`, auth, this.invoiceController.deleteInvoiceExcelFile);

        // ************************** create invoice ****************************************************
        this.router.get(`${this.path}/createInvoice/:id`, validate(schemas.getCreateInvoice), auth, this.invoiceController.createInvoice);
        this.router.get(`${this.path}/deleteInvoice/:id`, auth, this.invoiceController.deleteInvoice);
    }
}

export default invoiceRoute;

