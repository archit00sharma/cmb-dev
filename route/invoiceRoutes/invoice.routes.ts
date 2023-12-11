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
        this.router.get(`${this.path}/invoiceFromList`, validate(schemas.getInvoiceFromList, (req) => `/dashboard`), auth, this.invoiceController.invoiceFromList);
        this.router.post(`${this.path}/invoiceFromDataTable`, validate(schemas.postInvoiceFromDataTable, null, true), auth, this.invoiceController.invoiceFromDataTable);
        this.router.get(`${this.path}/addInvoiceFrom`, validate(schemas.getAddInvoiceFrom, (req) => `/invoice/invoiceFromList`), auth, this.invoiceController.addInvoiceFrom);
        this.router.post(`${this.path}/submitAddInvoiceFrom`, validate(schemas.postSubmitAddInvoiceFrom, (req) => `/invoice/addInvoiceFrom`), auth, this.invoiceController.submitAddInvoiceFrom);
        this.router.get(`${this.path}/editInvoiceFrom/:id`, validate(schemas.getEditInvoiceFrom, (req) => `/invoice/invoiceFromList`), auth, this.invoiceController.editInvoiceFrom);
        this.router.post(`${this.path}/submitEditInvoiceFrom/:id`, validate(schemas.postSubmitEditInvoiceFrom, (req) => `/invoice/editInvoiceFrom/${req.params.id}`), auth, this.invoiceController.submitEditInvoiceFrom);
        this.router.get(`${this.path}/deleteInvoiceFrom/:id`, validate(schemas.getDeleteInvoiceFrom, (req) => `/invoice/invoiceFromList`), auth, this.invoiceController.deleteInvoiceFrom);

        // ****************************** invoice to code **************************************
        this.router.get(`${this.path}/invoiceToList`, validate(schemas.getInvoiceToList, (req) => `/dashboard`), auth, this.invoiceController.invoiceToList);
        this.router.post(`${this.path}/invoiceToDataTable`, validate(schemas.postInvoiceToDataTable, null, true), auth, this.invoiceController.invoiceToDataTable);
        this.router.get(`${this.path}/addInvoiceTo`, validate(schemas.getAddInvoiceTo, (req) => `/invoice/invoiceToList`), auth, this.invoiceController.addInvoiceTo);
        this.router.post(`${this.path}/submitAddInvoiceTo`, validate(schemas.postSubmitAddInvoiceTo, (req) => `/invoice/addInvoiceTo`), auth, this.invoiceController.submitAddInvoiceTo);
        this.router.get(`${this.path}/editInvoiceTo/:id`, validate(schemas.getEditInvoiceTo, (req) => `/invoice/invoiceToList`), auth, this.invoiceController.editInvoiceTo);
        this.router.post(`${this.path}/submitEditInvoiceTo/:id`, validate(schemas.postSubmitEditInvoiceTo, (req) => `/invoice/editInvoiceTo/${req.params.id}`), auth, this.invoiceController.submitEditInvoiceTo);
        this.router.get(`${this.path}/deleteInvoiceTo/:id`, validate(schemas.getDeleteInvoiceTo, (req) => `/invoice/invoiceToList`), auth, this.invoiceController.deleteInvoiceTo);

        // ************************ BANK DETAILS ************************************************
        this.router.get(`${this.path}/bankDetailsList`, validate(schemas.getBankDetailsList, (req) => `/dashboard`), auth, this.invoiceController.bankDetailsList);
        this.router.post(`${this.path}/bankDetailsDataTable`, validate(schemas.postBankDetailsDataTable, null, true), auth, this.invoiceController.bankDetailsDataTable);
        this.router.get(`${this.path}/addBankDetails`, validate(schemas.getAddBankDetails, (req) => `/invoice/bankDetailsList`), auth, this.invoiceController.addBankDetails);
        this.router.get(`${this.path}/editBankDetails/:id`, validate(schemas.getEditBankDetails, (req) => `/invoice/bankDetailsList`), auth, this.invoiceController.editBankDetails);
        this.router.post(`${this.path}/submitEditBankDetails/:id`, validate(schemas.postSubmitEditBankDetails, (req) => `/invoice/editBankDetails/${req.params.id}`), auth, this.invoiceController.submitEditBankDetails);
        this.router.post(`${this.path}/submitAddBankDetails`, validate(schemas.postSubmitAddBankDetails, (req) => `/invoice/addBankDetails`), auth, this.invoiceController.submitAddBankDetails);
        this.router.get(`${this.path}/deleteBankDetails/:id`, validate(schemas.getDeleteBankDetails, (req) => `/invoice/bankDetailsList`), auth, this.invoiceController.deleteBankDetails);

        // ********************** INVOICE RATE CRUD********************************************
        this.router.get(`${this.path}/rateList`, validate(schemas.getRateList, (req) => `/dashboard`), auth, this.invoiceController.rateList);
        this.router.post(`${this.path}/rateListDataTable`, validate(schemas.postRateListDataTable, null, true), auth, this.invoiceController.rateListDataTable);
        this.router.post(`${this.path}/addRate`, validate(schemas.postAddRate, (req) => `/invoice/rateList`), auth, this.invoiceController.addRate);
        this.router.post(`${this.path}/editRate/:id`, validate(schemas.postEditRate, (req) => `/invoice/editRate/${req.params.id}`), auth, this.invoiceController.editRate);
        this.router.get(`${this.path}/deleteRate/:id`, validate(schemas.getDeleteRate, (req) => `/invoice/rateList`), auth, this.invoiceController.deleteRate);

        // ************************** INVOICE CRUD **************************************

        // ******************* invoice table ***********************************
        this.router.get(`${this.path}/invoiceList`, validate(schemas.getInvoiceList, (req) => `/invoice/dashboard`), auth, this.invoiceController.invoiceList);
        this.router.post(`${this.path}/invoiceListDataTable`, validate(schemas.postInvoiceListDataTable, (req) => `/invoice/invoiceList`), auth, this.invoiceController.invoiceListDataTable);
        this.router.get(`${this.path}/addInvoice`, validate(schemas.getAddInvoice, (req) => `/invoice/invoiceList`), auth, this.invoiceController.addInvoice);
        this.router.post(`${this.path}/addInvoiceSubmit`, validate(schemas.postAddInvoiceSubmit, (req) => `/invoice/addInvoice`), auth, this.invoiceController.addInvoiceSubmit);

        // ************** invoice excel status table *************************************
        this.router.get(`${this.path}/invoiceExcelDataStatus`, validate(schemas.getInvoiceExcelDataStatus, (req) => `/invoice/dashboard`), auth, this.invoiceController.invoiceExcelDataStatus);
        this.router.post(`${this.path}/invoiceExcelDataStatusDataTable`, validate(schemas.postInvoiceExcelDataStatusDataTable, null, true), auth, this.invoiceController.invoiceExcelDataStatusDataTable);
        this.router.get(`${this.path}/deleteInvoiceExcelDataStatus/:id/:uniqueId`, validate(schemas.getDeleteInvoiceExcelDataStatus, (req) => `/invoice/invoiceExcelDataStatus`), auth, this.invoiceController.deleteInvoiceExcelDataStatus);

        // ************************ invoice excel data table *********************
        this.router.get(`${this.path}/invoiceExcelData/:id/:invoiceExcelFormat/:conveyance?`, validate(schemas.getInvoiceExcelData, (req) => `/invoice/invoiceExcelDataStatus`), auth, this.invoiceController.invoiceExcelData);
        this.router.post(`${this.path}/invoiceExcelDataDataTable`, validate(schemas.postInvoiceExcelDataDataTable, null, true), auth, this.invoiceController.invoiceExcelDataDataTable);
        this.router.post(`${this.path}/editInvoiceExcelData/:id`, validate(schemas.postEditInvoiceExcelData, (req) => `/invoice/invoiceExcelData/${req.params.id}/${req.body.invoiceExcelFormat}${req.body.conveyance ? '/' + req.body.conveyance : ''}`), auth, this.invoiceController.editInvoiceExcelData);
        this.router.get(`${this.path}/deleteInvoiceExcelData/:id/:uniqueId/:invoiceExcelFormat/:conveyance?`, validate(schemas.getDeleteInvoiceExcelData, (req) => `/invoice/invoiceExcelData/${req.params.uniqueId}/${req.params.invoiceExcelFormat}${req.params.conveyance ? '/' + req.body.conveyance : ''}`), auth, this.invoiceController.deleteInvoiceExcelData);


        // ************************ invoice excel data excel table *********************
        this.router.get(`${this.path}/createInvoiceDataExcel/:invoiceExcelFormat/:uniqueId`, validate(schemas.getCreateInvoiceDataExcel, (req) => `/invoice/invoiceExcelDataStatus`), auth, this.invoiceController.createInvoiceDataExcel);
        this.router.get(`${this.path}/invoiceDataExcelStatus`, validate(schemas.getInvoiceDataExcelStatus, (req) => `/invoice/invoiceExcelDataStatus`), auth, this.invoiceController.invoiceDataExcelStatus);
        this.router.post(`${this.path}/invoiceDataExcelStatusDataTable`, validate(schemas.postInvoiceDataExcelStatusDataTable, null, true), auth, this.invoiceController.invoiceDataExcelStatusDataTable);
        this.router.get(`${this.path}/deleteInvoiceExcelFile/:id`, validate(schemas.getDeleteInvoiceExcelFile, (req) => `/invoice/invoiceExcelDataStatus`), auth, this.invoiceController.deleteInvoiceExcelFile);

        // ************************** create invoice ****************************************************
        this.router.get(`${this.path}/createInvoice/:id`, validate(schemas.getCreateInvoice, (req) => `/invoice/invoiceExcelDataStatus`), auth, this.invoiceController.createInvoice);
        this.router.get(`${this.path}/deleteInvoice/:id`,validate(schemas.getDeleteInvoice, (req) => `/invoice/invoiceExcelDataStatus`), auth, this.invoiceController.deleteInvoice);
    }
}

export default invoiceRoute;

