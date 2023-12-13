


import { NextFunction, Response } from "express";
import { v1 as uuidv1 } from 'uuid';
import moment from 'moment';
import fs from 'fs';
import path from "path";


import invoiceService from "../../services/invoiceServices/invoice.service";
import productService from "@/services/commonServicesFile/product.service";
import areaService from "@/services/commonServicesFile/area.service";
import bankService from "@/services/commonServicesFile/bank.service";
import caseService from "@/services/commonServicesFile/case.service";

import invoiceFromSearch from "@/helpers/customSearch/invoice/invoiceFrom";
import invoiceToSearch from "@/helpers/customSearch/invoice/invoiceTo";
import bankDetailsSearch from "@/helpers/customSearch/invoice/bankDetails";
import invoiceSearch from "@/helpers/customSearch/invoice/invoice";
import rateSearch from "@/helpers/customSearch/invoice/rate";
import invoiceExcelDataStatusSearch from "@/helpers/customSearch/invoice/invoiceExcelDataStatus";
import invoiceExcel from "@/helpers/invoices/invoiceExcel";
import cslFormatSearch from '@/helpers/customSearch/invoice/excelData.ts/cslFormat';
import bandhanFormatSearch from '@/helpers/customSearch/invoice/excelData.ts/bandhanFormat';
import hdfcFormatSearch from '@/helpers/customSearch/invoice/excelData.ts/hdfcFormat';
import commonFormatSearch from '@/helpers/customSearch/invoice/excelData.ts/commonFormat';
import createInvoiceDataExcel from "@/helpers/createExcel/invoiceDataExcel/invoiceDataExcel";
import createInvoice from "@/helpers/createExcel/invoice/invoice";



class invoiceController {
    public invoiceService = new invoiceService();
    public productService = new productService();
    public areaService = new areaService();
    public bankService = new bankService();
    public caseService = new caseService();


    // ************************ INVOICE FROM CODE ********************************

    public invoiceFromList = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user
            res.locals.message = req.flash()
            res.render("invoice/invoiceFrom/invoiceFrom", { role, email });
        } catch (error) {
            next(error)
        }
    };

    public invoiceFromDataTable = async (req: any, res: Response, next: NextFunction) => {
        try {
            let searchArray = await invoiceFromSearch(req.body.columns);
            let data: any = [];
            const [invoiceFromData] = await this.invoiceService.getAllInvoiceFrom(req, searchArray)

            let count = parseInt(req.body.start) + 1;
            if (invoiceFromData) {
                for (let i = 0; i < invoiceFromData.data.length; i++) {
                    data.push({
                        count: count,
                        templateName: invoiceFromData.data[i].templateName,
                        action: `<div> 
                                    <a class="btn w-35px h-35px mr-1 btn-warning text-uppercase btn-sm" data-toggle="tooltip" title="Edit" href="/invoice/editInvoiceFrom/${invoiceFromData.data[i]._id}" data-original-title="Delete">
                                    <i class="fas fa-pencil"></i>
                                    </a> 
                                    <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/invoice/deleteInvoiceFrom/${invoiceFromData.data[i]._id}" data-original-title="Delete">
                                        <i class="far fa-trash-alt"></i> 
                                    </a>    
                                </div>`,
                    });
                    count++;
                }
                if (data.length == invoiceFromData.data.length) {
                    let jsonData = JSON.stringify({
                        draw: parseInt(req.body.draw),
                        recordsTotal: invoiceFromData.sum1.sum,
                        recordsFiltered: invoiceFromData.sum2.sum,
                        data,
                    });
                    res.send(jsonData);
                }
            } else {
                let jsonData = JSON.stringify({
                    draw: parseInt(req.body.draw),
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data,
                });
                res.send(jsonData);
            }

        } catch (error) {
            next(error);
        }
    };

    public addInvoiceFrom = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user
            res.locals.message = req.flash()
            res.render("invoice/invoiceFrom/addInvoiceFrom", { role, email });
        } catch (error) {
            next(error)
        }
    };

    public submitAddInvoiceFrom = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { code, message } = await this.invoiceService.addInvoiceFrom(req.body);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "updated successfully");
            res.redirect(code === 401 ? '/invoice/addInvoiceFrom' : '/invoice/invoiceFromList');

        } catch (error) {
            next(error)
        }
    };

    public editInvoiceFrom = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user
            const { id } = req.params;
            res.locals.message = req.flash()
            const invoiceData = await this.invoiceService.getInvoiceFrom({ _id: id });
            res.render("invoice/invoiceFrom/editInvoiceForm.ejs", { role, email, invoiceData });
        } catch (error) {
            next(error)
        }
    };

    public submitEditInvoiceFrom = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const [allowDeleteInvoiceData, allowDeleteInvoice] = await Promise.all([
                this.invoiceService.getInvoiceExcelDataStatus({ status: 'processing' }),
                this.invoiceService.getInvoice({ status: 'processing' })
            ]);

            if (allowDeleteInvoiceData || allowDeleteInvoice) {
                req.flash('error', 'Kindly wait, other files are processing');
                return res.redirect(`/invoice/editInvoiceFrom/${id}`);;
            }

            const { code, message } = await this.invoiceService.updateInvoiceFrom(id, req.body);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "updated successfully");
            res.redirect(`/invoice/editInvoiceFrom/${id}`);
        } catch (error) {
            next(error)
        }
    };

    public deleteInvoiceFrom = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const [allowDeleteInvoiceData, allowDeleteInvoice] = await Promise.all([
                this.invoiceService.getInvoiceExcelDataStatus({ status: 'processing' }),
                this.invoiceService.getInvoice({ status: 'processing' })
            ]);

            if (allowDeleteInvoiceData || allowDeleteInvoice) {
                req.flash('error', 'Kindly wait, other files are processing');
                return res.redirect("/invoice/invoiceFromList");
            }
            const { code, message } = await this.invoiceService.deleteInvoiceFrom(id);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "deleted successfully");
            res.redirect("/invoice/invoiceFromList");
        } catch (error) {
            next(error)
        }
    };

    // ********************* INVOICE TO CODE **********************************

    public invoiceToList = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user
            res.locals.message = req.flash()
            res.render("invoice/invoiceTo/invoiceTo", { role, email });
        } catch (error) {
            next(error)
        }

    };

    public invoiceToDataTable = async (req: any, res: Response, next: NextFunction) => {
        try {

            let searchArray = await invoiceToSearch(req.body.columns);
            let data: any = [];
            const [invoiceToData] = await this.invoiceService.getAllInvoiceTo(req, searchArray)

            let count = parseInt(req.body.start) + 1;
            if (invoiceToData) {
                for (let i = 0; i < invoiceToData.data.length; i++) {
                    data.push({
                        count: count,
                        templateName: invoiceToData.data[i].templateName,
                        action: `<div> 
                                    <a class="btn w-35px h-35px mr-1 btn-warning text-uppercase btn-sm" data-toggle="tooltip" title="Edit" href="/invoice/editInvoiceTo/${invoiceToData.data[i]._id}" data-original-title="Delete">
                                    <i class="fas fa-pencil"></i>
                                    </a> 
                                    <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/invoice/deleteInvoiceTo/${invoiceToData.data[i]._id}" data-original-title="Delete">
                                        <i class="far fa-trash-alt"></i> 
                                    </a>    
                                </div>`,
                    });
                    count++;
                }
                if (data.length == invoiceToData.data.length) {
                    let jsonData = JSON.stringify({
                        draw: parseInt(req.body.draw),
                        recordsTotal: invoiceToData.sum1.sum,
                        recordsFiltered: invoiceToData.sum2.sum,
                        data,
                    });
                    res.send(jsonData);
                }
            } else {
                let jsonData = JSON.stringify({
                    draw: parseInt(req.body.draw),
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data,
                });
                res.send(jsonData);
            }

        } catch (error) {
            next(error);
        }
    };

    public addInvoiceTo = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user
            res.locals.message = req.flash()
            res.render("invoice/invoiceTo/addInvoiceTo", { role, email });
        } catch (error) {
            next(error)
        }
    };

    public submitAddInvoiceTo = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { code, message } = await this.invoiceService.addInvoiceTo(req.body);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "added successfully");
            res.redirect(`/invoice/invoiceToList`);
        } catch (error) {
            next(error)
        }
    };

    public editInvoiceTo = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user
            const { id } = req.params
            res.locals.message = req.flash()
            const invoiceData = await this.invoiceService.getInvoiceTo(id)
            res.render("invoice/invoiceTo/editInvoiceTo.ejs", { role, email, invoiceData });
        } catch (error) {
            next(error)
        }
    };

    public submitEditInvoiceTo = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const [allowDeleteInvoiceData, allowDeleteInvoice] = await Promise.all([
                this.invoiceService.getInvoiceExcelDataStatus({ status: 'processing' }),
                this.invoiceService.getInvoice({ status: 'processing' })
            ]);

            if (allowDeleteInvoiceData || allowDeleteInvoice) {
                req.flash('error', 'Kindly wait, other files are processing');
                return res.redirect(`/invoice/editInvoiceTo/${id}`);
            }
            const { code, message } = await this.invoiceService.updateInvoiceTo(id, req.body);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "updated successfully");
            res.redirect(`/invoice/editInvoiceTo/${id}`);
        } catch (error) {
            next(error)
        }
    };

    public deleteInvoiceTo = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const [allowDeleteInvoiceData, allowDeleteInvoice] = await Promise.all([
                this.invoiceService.getInvoiceExcelDataStatus({ status: 'processing' }),
                this.invoiceService.getInvoice({ status: 'processing' })
            ]);

            if (allowDeleteInvoiceData || allowDeleteInvoice) {
                req.flash('error', 'Kindly wait, other files are processing');
                return res.redirect("/invoice/invoiceToList");
            }
            const { code, message } = await this.invoiceService.deleteInvoiceTo(id);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "deleted successfully");
            res.redirect("/invoice/invoiceToList");
        } catch (error) {
            next(error)
        }
    };


    // ************************ Bank Details Code ***********************************************

    public bankDetailsList = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user
            res.locals.message = req.flash()
            res.render("invoice/bankDetails/bankDetails", { role, email });
        } catch (error) {
            next(error)
        }

    };

    public bankDetailsDataTable = async (req: any, res: Response, next: NextFunction) => {
        try {

            let searchArray = await bankDetailsSearch(req.body.columns);
            let data: any = [];
            const [bankDetailsData] = await this.invoiceService.getAllBankDetails(req, searchArray)

            let count = parseInt(req.body.start) + 1;
            if (bankDetailsData) {
                for (let i = 0; i < bankDetailsData.data.length; i++) {
                    data.push({
                        count: count,
                        templateName: bankDetailsData.data[i].templateName,
                        action: `<div> 
                                    <a class="btn w-35px h-35px mr-1 btn-warning text-uppercase btn-sm" data-toggle="tooltip" title="Edit" href="/invoice/editBankDetails/${bankDetailsData.data[i]._id}" data-original-title="Delete">
                                    <i class="fas fa-pencil"></i>
                                    </a> 
                                    <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/invoice/deleteBankDetails/${bankDetailsData.data[i]._id}" data-original-title="Delete">
                                        <i class="far fa-trash-alt"></i> 
                                    </a>    
                                </div>`,
                    });
                    count++;
                }
                if (data.length == bankDetailsData.data.length) {
                    let jsonData = JSON.stringify({
                        draw: parseInt(req.body.draw),
                        recordsTotal: bankDetailsData.sum1.sum,
                        recordsFiltered: bankDetailsData.sum2.sum,
                        data,
                    });
                    res.send(jsonData);
                }
            } else {
                let jsonData = JSON.stringify({
                    draw: parseInt(req.body.draw),
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data,
                });
                res.send(jsonData);
            }

        } catch (error) {
            next(error);
        }
    };

    public addBankDetails = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user
            res.locals.message = req.flash()
            res.render("invoice/bankDetails/addBankDetails", { role, email });
        } catch (error) {
            next(error)
        }
    };

    public submitAddBankDetails = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { code, message } = await this.invoiceService.addBankDetails(req.body);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "added successfully");
            res.redirect(`/invoice/bankDetailsList`);
        } catch (error) {
            next(error)
        }
    };

    public editBankDetails = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user;
            const { id } = req.params
            res.locals.message = req.flash();
            const invoiceData = await this.invoiceService.getBankDetails(id);
            res.render("invoice/bankDetails/editBankDetails.ejs", { role, email, invoiceData });
        } catch (error) {
            next(error)
        }
    };

    public submitEditBankDetails = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const [allowDeleteInvoiceData, allowDeleteInvoice] = await Promise.all([
                this.invoiceService.getInvoiceExcelDataStatus({ status: 'processing' }),
                this.invoiceService.getInvoice({ status: 'processing' })
            ]);

            if (allowDeleteInvoiceData || allowDeleteInvoice) {
                req.flash('error', 'Kindly wait, other files are processing');
                return res.redirect(`/invoice/editBankDetails/${id}`);
            }
            const { code, message } = await this.invoiceService.updateBankDetails(req.params.id, req.body);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "updated successfully");
            res.redirect(`/invoice/editBankDetails/${id}`);
        } catch (error) {
            next(error)
        }
    };

    public deleteBankDetails = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const [allowDeleteInvoiceData, allowDeleteInvoice] = await Promise.all([
                this.invoiceService.getInvoiceExcelDataStatus({ status: 'processing' }),
                this.invoiceService.getInvoice({ status: 'processing' })
            ]);

            if (allowDeleteInvoiceData || allowDeleteInvoice) {
                req.flash('error', 'Kindly wait, other files are processing');
                return res.redirect("/invoice/bankDetailsList");
            }
            const { code, message } = await this.invoiceService.deleteBankDetails(id);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "deleted successfully");
            res.redirect("/invoice/bankDetailsList");
        } catch (error) {
            next(error)
        }
    };


    // ******************************* RATE CRUD ******************************************

    public rateList = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user
            res.locals.message = req.flash();
            const [productList, bankList, areaList] = await Promise.all([
                this.productService.getAllProduct(),
                this.bankService.getAllBank(),
                this.areaService.getAllArea()
            ]);
            res.render("invoice/rate/rateListDataTable", { role, email, productList, bankList, areaList });
        } catch (error) {
            next(error)
        }

    };

    public rateListDataTable = async (req: any, res: Response, next: NextFunction) => {
        try {

            let searchArray = await rateSearch(req.body.columns);
            let data: any = [];
            const [rateData] = await this.invoiceService.getAllRates(req, searchArray)

            let count = parseInt(req.body.start) + 1;
            if (rateData) {
                for (let i = 0; i < rateData.data.length; i++) {
                    data.push({
                        count: count,
                        bank: rateData.data[i].bank,
                        area: rateData.data[i].area,
                        product: rateData.data[i].product,
                        from: rateData.data[i].from,
                        to: rateData.data[i].to,
                        point: rateData.data[i].point,
                        rate: rateData.data[i].rate,
                        action: `<div> 
                                <button class="btn w-35px h-35px mr-1 btn-warning text-uppercase btn-sm" data-toggle="tooltip" title="Edit" data-id="${rateData.data[i]._id}"  data-original-title="Delete">
                                <i class="fas fa-pencil"></i>
                                </button> 
                                <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/invoice/deleteRate/${rateData.data[i]._id}" data-original-title="Delete">
                                    <i class="far fa-trash-alt"></i> 
                                </a>    
                            </div>`,
                    });
                    count++;
                }
                if (data.length == rateData.data.length) {
                    let jsonData = JSON.stringify({
                        draw: parseInt(req.body.draw),
                        recordsTotal: rateData.sum1.sum,
                        recordsFiltered: rateData.sum2.sum,
                        data,
                    });
                    res.send(jsonData);
                }
            } else {
                let jsonData = JSON.stringify({
                    draw: parseInt(req.body.draw),
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data,
                });
                res.send(jsonData);
            }

        } catch (error) {
            next(error);
        }
    };

    public addRate = async (req: any, res: Response, next: NextFunction) => {
        try {
            const data = []
            const { area, product, bank, rate, from, to, point } = req.body;

            for (let i = 0; i < product.length; i++) {
                for (let j = 0; j < area.length; j++) {
                    let obj = {
                        area: area[j],
                        product: product[i],
                        bank: bank,
                        from: parseInt(from.trim()),
                        to: parseInt(to.trim()),
                        rate: parseInt(rate.trim()),
                        point: parseInt(point.trim())
                    }
                    data.push(obj);
                }
            }
            const { code, message } = await this.invoiceService.addRate(data);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "added successfully");
            res.send('success');

        } catch (error) {
            next(error)
        }
    };

    public editRate = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const [allowDeleteInvoiceData, allowDeleteInvoice] = await Promise.all([
                this.invoiceService.getInvoiceExcelDataStatus({ status: 'processing' }),
                this.invoiceService.getInvoice({ status: 'processing' })
            ]);

            if (allowDeleteInvoiceData || allowDeleteInvoice) {
                req.flash('error', 'Kindly wait, other files are processing');
                return res.send("success");
            }
            const { code, message } = await this.invoiceService.updateRate(id, req.body);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "updated successfully");
            res.send("success");
        } catch (error) {
            next(error)
        };
    };

    public deleteRate = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const [allowDeleteInvoiceData, allowDeleteInvoice] = await Promise.all([
                this.invoiceService.getInvoiceExcelDataStatus({ status: 'processing' }),
                this.invoiceService.getInvoice({ status: 'processing' })
            ]);

            if (allowDeleteInvoiceData || allowDeleteInvoice) {
                req.flash('error', 'Kindly wait, other files are processing');
                return res.redirect("/invoice/rateList");
            }
            const { code, message } = await this.invoiceService.deleteRate(id);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "deleted successfully");
            res.redirect("/invoice/rateList");
        } catch (error) {
            next(error)
        }
    };



    // **************************** invoice crud *********************************

    // ********************** invoices table ***********************

    public invoiceList = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user
            res.locals.message = req.flash();
            res.render("invoice/invoices/invoiceList", { role, email });
        } catch (error) {
            next(error)
        }
    };

    public invoiceListDataTable = async (req: any, res: Response, next: NextFunction) => {
        try {

            let searchArray = await invoiceSearch(req.body.columns);
            let data: any = [];
            const [invoiceListData] = await this.invoiceService.getAllInvoiceList(req, searchArray)

            let count = parseInt(req.body.start) + 1;
            if (invoiceListData) {
                for (let i = 0; i < invoiceListData.data.length; i++) {
                    data.push({
                        count: count,
                        name: invoiceListData.data[i].name,
                        invoiceNo: invoiceListData.data[i].invoiceNo || '',
                        status: invoiceListData.data[i].status,
                        invoiceFormat: invoiceListData.data[i].invoiceFormat || '',
                        error: invoiceListData.data[i].error || 'Na',
                        action: `<div> 
                                    ${invoiceListData.data[i].status === 'success' ? `<a class="btn w-35px h-35px mr-1 btn-green text-uppercase btn-sm" data-toggle="tooltip" title="Download" href=${process.env.BASE_URL}${invoiceListData.data[i].fileUrl} data-original-title="Download">
                                    <i class="fa-solid fa-file-excel"></i>
                                    </a>`: ''}  
                                    ${['success', 'failed'].includes(invoiceListData.data[i].status) ? `<a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/invoice/deleteInvoice/${invoiceListData.data[i]._id}" data-original-title="Delete">
                                    <i class="far fa-trash-alt"></i> 
                                </a>`: ''}      
                                </div>`,
                    });
                    count++;
                }
                if (data.length == invoiceListData.data.length) {
                    let jsonData = JSON.stringify({
                        draw: parseInt(req.body.draw),
                        recordsTotal: invoiceListData.sum1.sum,
                        recordsFiltered: invoiceListData.sum2.sum,
                        data,
                    });
                    res.send(jsonData);
                }
            } else {
                let jsonData = JSON.stringify({
                    draw: parseInt(req.body.draw),
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data,
                });
                res.send(jsonData);
            }

        } catch (error) {
            next(error);
        }
    };

    public addInvoice = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user
            res.locals.message = req.flash();
            const [invoiceToList, invoiceFromList, bankDetailsList, productList, bankList, areaList] = await Promise.all([
                this.invoiceService.allInvoiceTo(),
                this.invoiceService.allInvoiceFrom(),
                this.invoiceService.allBankDetails(),
                this.productService.getAllProduct(),
                this.bankService.getAllBank(),
                this.areaService.getAllArea()
            ]);
            res.render("invoice/invoices/addInvoice", { role, email, invoiceToList, invoiceFromList, bankDetailsList, productList, bankList, areaList });
        } catch (error) {
            next(error)
        }
    };

    public addInvoiceSubmit = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { product, area, bank, invoiceFormat, invoiceExcelFormat, invoiceToTemplate, invoiceFromTemplate, bankDetailsTemplate, min, max, conveyance } = req.body;
            const data: any = {
                name: `${bank}_${Date.now()}`,
                uniqueId: uuidv1(),
                status: "processing",
                data: {
                    product,
                    area,
                    bank,
                    invoiceFormat,
                    invoiceExcelFormat,
                    invoiceTo: invoiceToTemplate,
                    invoiceFrom: invoiceFromTemplate,
                    bankDetails: bankDetailsTemplate,
                    dateFrom: new Date(min),
                    dateTo: new Date(max),
                }
            }
            conveyance && (data.data.conveyance = conveyance);
            const { code, message } = await this.invoiceService.createInvoiceExcelDataStatus(data);

            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "added successfully");
            code !== 401 && invoiceExcel(data);
            res.redirect('/invoice/addInvoice');
        } catch (error) {
            next(error)
        }
    };


    // *********** invoice excel data status ****************************

    public invoiceExcelDataStatus = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user;
            res.locals.message = req.flash();
            res.render("invoice/invoices/invoiceExcelDataStatusList.ejs", { role, email, });
        } catch (error) {
            next(error)
        }
    };

    public invoiceExcelDataStatusDataTable = async (req: any, res: Response, next: NextFunction) => {
        try {
            let searchArray = await invoiceExcelDataStatusSearch(req.body.columns);
            let data: any = [];
            const [invoiceExcelDataStatusList] = await this.invoiceService.getAllInvoiceExcelDataStatusList(req, searchArray);
            let count = parseInt(req.body.start) + 1;
            if (invoiceExcelDataStatusList) {
                for (let i = 0; i < invoiceExcelDataStatusList.data.length; i++) {
                    data.push({
                        count: count,
                        name: invoiceExcelDataStatusList.data[i].name,
                        status: invoiceExcelDataStatusList.data[i].status,
                        invoiceExcelFormat: invoiceExcelDataStatusList.data[i].data.invoiceExcelFormat,
                        invoiceFormat: invoiceExcelDataStatusList.data[i].data.invoiceFormat,
                        error: invoiceExcelDataStatusList.data[i].error || 'NA',
                        action: `<div>
                                    <a class="btn w-35px h-35px mr-1 btn-warning text-uppercase btn-sm" data-toggle="tooltip" title="View/Edit"
                                        ${invoiceExcelDataStatusList.data[i].status !== 'success' ? 'href="#"' : 'href="/invoice/invoiceExcelData/' + invoiceExcelDataStatusList.data[i].uniqueId + '/' + invoiceExcelDataStatusList.data[i].data.invoiceExcelFormat + (invoiceExcelDataStatusList.data[i].data.invoiceExcelFormat === 'csl_format' ? '/' + invoiceExcelDataStatusList.data[i].data.conveyance : '') + '"'}>
                                        <i class="fa-solid fa-eye"></i>
                                    </a>
                                    ${invoiceExcelDataStatusList.data[i].status !== 'success' ? '' : `<a href="/invoice/createInvoiceDataExcel/${invoiceExcelDataStatusList.data[i].data.invoiceExcelFormat}/${invoiceExcelDataStatusList.data[i].uniqueId}" style="display: inline-block; padding: 10px 20px; text-align: center; text-decoration: none; background-color: #007BFF; color: #ffffff; border: 1px solid #007BFF; cursor: pointer;">Create Excel</a>`}
                                    ${invoiceExcelDataStatusList.data[i].status !== 'success' ? '' : `<a href="/invoice/createInvoice/${invoiceExcelDataStatusList.data[i]._id}" style="display: inline-block; padding: 10px 20px; text-align: center; text-decoration: none; background-color: #007BFF; color: #ffffff; border: 1px solid #007BFF; cursor: pointer;">Create Invoice</a>`}
                                    <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete"
                                        ${invoiceExcelDataStatusList.data[i].status === 'processing' ? 'href="#"' : 'href="/invoice/deleteInvoiceExcelDataStatus/' + invoiceExcelDataStatusList.data[i]._id + '/' + invoiceExcelDataStatusList.data[i].uniqueId + '"'}>
                                        <i class="far fa-trash-alt"></i>
                                    </a>
                                    
                                </div>`,
                    });
                    count++;
                }
                if (data.length == invoiceExcelDataStatusList.data.length) {
                    let jsonData = JSON.stringify({
                        draw: parseInt(req.body.draw),
                        recordsTotal: invoiceExcelDataStatusList.sum1.sum,
                        recordsFiltered: invoiceExcelDataStatusList.sum2.sum,
                        data,
                    });
                    res.send(jsonData);
                }
            } else {
                let jsonData = JSON.stringify({
                    draw: parseInt(req.body.draw),
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data,
                });
                res.send(jsonData);
            }

        } catch (error) {
            next(error);
        }
    };

    public deleteInvoiceExcelDataStatus = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { id, uniqueId } = req.params;
            const [allowDeleteInvoiceData, allowDeleteInvoice] = await Promise.all([
                this.invoiceService.getInvoiceDataExcel({ status: 'processing' }),
                this.invoiceService.getInvoice({ status: 'processing' })
            ]);

            if (allowDeleteInvoiceData || allowDeleteInvoice) {
                req.flash('error', 'Kindly wait, other files are processing');
                return res.redirect("/invoice/invoiceExcelDataStatus");
            }
            const { code, message } = await this.invoiceService.deleteInvoiceExcelDataStatus(id, uniqueId);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "deleted successfully");
            res.redirect("/invoice/invoiceExcelDataStatus");
        } catch (error) {
            next(error)
        }
    };

    // *********** invoice excel data ****************************

    public invoiceExcelData = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user;
            const { id, invoiceExcelFormat, conveyance } = req.params;
            const areaList = await this.areaService.getAllArea()
            res.locals.message = req.flash();
            switch (invoiceExcelFormat) {
                case "common_format":
                    res.render("invoice/invoices/invoiceExcelData/invoiceCaseDataListCommon.ejs", { role, email, id, invoiceExcelFormat, areaList });
                    break;
                case "csl_format":
                    res.render("invoice/invoices/invoiceExcelData/invoiceCaseDataListCsl.ejs", { role, email, id, invoiceExcelFormat, conveyance, areaList });
                    break;
                case "bandhan_format":
                    res.render("invoice/invoices/invoiceExcelData/invoiceCaseDataListBandhan.ejs", { role, email, id, invoiceExcelFormat, areaList });
                    break;
                case "hdfc_format":
                    res.render("invoice/invoices/invoiceExcelData/invoiceCaseDataListHdfc.ejs", { role, email, id, invoiceExcelFormat, areaList });
                    break;
                default:
                    req.flash("error", "invalid format")
                    break;
            }

        } catch (error) {
            next(error)
        }
    };

    public invoiceExcelDataDataTable = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { invoiceExcelFormat } = req.body;
            let searchArray
            switch (invoiceExcelFormat) {
                case 'common_format':
                    searchArray = await commonFormatSearch(req.body.columns);
                    break;
                case "csl_format":
                    searchArray = await cslFormatSearch(req.body.columns);
                    break;
                case "bandhan_format":
                    searchArray = await bandhanFormatSearch(req.body.columns);
                    break;
                case "hdfc_format":
                    searchArray = await hdfcFormatSearch(req.body.columns);
                    break;
                default:
                    break;
            }

            let data: any = [];
            const [invoiceExcelData] = await this.invoiceService.getAllInvoiceExcelData(req, searchArray)
            let count = parseInt(req.body.start) + 1;
            if (invoiceExcelData) {
                switch (invoiceExcelFormat) {
                    case "common_format":
                        for (let i = 0; i < invoiceExcelData.data.length; i++) {
                            data.push({
                                count: count,
                                date: invoiceExcelData.data[i].date,
                                id: invoiceExcelData.data[i].fileNo,
                                barcode: invoiceExcelData.data[i].barCode,
                                applicantName: invoiceExcelData.data[i].applicantName,
                                addressType: invoiceExcelData.data[i].addressType,
                                product: invoiceExcelData.data[i].product,
                                address: invoiceExcelData.data[i].address,
                                branch: invoiceExcelData.data[i].branch,
                                area: invoiceExcelData.data[i].area,
                                mobile: invoiceExcelData.data[i].mobileNo,
                                status: invoiceExcelData.data[i].caseStatus,
                                point: invoiceExcelData.data[i].point,
                                km: invoiceExcelData.data[i].distance,
                                rate: invoiceExcelData.data[i].rate,
                                action: `<div> 
                                            <button class="btn w-35px h-35px mr-1 btn-warning text-uppercase btn-sm" data-toggle="tooltip" title="Edit" data-uniqueId="${invoiceExcelData.data[i].uniqueId}" data-id="${invoiceExcelData.data[i]._id}" data-bank="${invoiceExcelData.data[i].bank}" data-original-title="Delete">
                                            <i class="fas fa-pencil"></i>
                                            </button> 
                                            <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/invoice/deleteInvoiceExcelData/${invoiceExcelData.data[i]._id}/${req.body.id}/${invoiceExcelFormat}" data-original-title="Delete">
                                                <i class="far fa-trash-alt"></i> 
                                            </a>    
                                        </div>`,
                            });
                            count++;
                        }
                        break;
                    case "csl_format":
                        for (let i = 0; i < invoiceExcelData.data.length; i++) {
                            data.push({
                                count: count,
                                id: invoiceExcelData.data[i].fileNo,
                                applicantName: invoiceExcelData.data[i].applicantName,
                                addressType: invoiceExcelData.data[i].addressType,
                                address: invoiceExcelData.data[i].address,
                                area: invoiceExcelData.data[i].area,
                                mobile: invoiceExcelData.data[i].mobileNo,
                                status: invoiceExcelData.data[i].caseStatus,
                                point: invoiceExcelData.data[i].point,
                                km: invoiceExcelData.data[i].distance,
                                conveyance: invoiceExcelData.data[i].conveyance?.distance,
                                product: invoiceExcelData.data[i].product,
                                rate: invoiceExcelData.data[i].rate,
                                action: `<div> 
                                            <button class="btn w-35px h-35px mr-1 btn-warning text-uppercase btn-sm" data-toggle="tooltip" title="Edit" data-uniqueId="${invoiceExcelData.data[i].uniqueId}" data-id="${invoiceExcelData.data[i]._id}" data-bank="${invoiceExcelData.data[i].bank}"  data-original-title="Delete">
                                            <i class="fas fa-pencil"></i>
                                            </button> 
                                            <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/invoice/deleteInvoiceExcelData/${invoiceExcelData.data[i]._id}/${req.body.id}/${invoiceExcelFormat}/${invoiceExcelData.data[i].conveyance?.distance}" data-original-title="Delete">
                                                <i class="far fa-trash-alt"></i> 
                                            </a>    
                                        </div>`,
                            });
                            count++;
                        }
                        break;
                    case "bandhan_format":
                        for (let i = 0; i < invoiceExcelData.data.length; i++) {
                            data.push({
                                count: count,
                                fileNo: invoiceExcelData.data[i].fileNo,
                                applicantName: invoiceExcelData.data[i].applicantName,
                                address: invoiceExcelData.data[i].address,
                                addressType: invoiceExcelData.data[i].addressType,
                                caseStatus: invoiceExcelData.data[i].caseStatus,
                                caseUploaded: moment(invoiceExcelData.data[i].caseUploaded).utc().format("YYYY-MM-DD HH:mm:ss"),
                                caseSubmitted: moment(invoiceExcelData.data[i].seniorSupervisor?.submittedDate || invoiceExcelData.data[i].manager?.submittedDate || invoiceExcelData.data[i].admin?.submittedDate).utc().format("YYYY-MM-DD HH:mm:ss") || 'Na',
                                agencyName: invoiceExcelData.data[i].agencyName,
                                area: invoiceExcelData.data[i].area,
                                product: invoiceExcelData.data[i].product,
                                state: invoiceExcelData.data[i].state,
                                branchId: invoiceExcelData.data[i].branchId || "Na",
                                businessBranch: invoiceExcelData.data[i].businessBranch || "Na",
                                point: invoiceExcelData.data[i].point,
                                km: invoiceExcelData.data[i].distance,
                                rate: invoiceExcelData.data[i].rate,
                                businessHrs: invoiceExcelData.data[i].businessHrs ? invoiceExcelData.data[i].businessHrs :
                                    (function () {
                                        const caseUploaded = moment(invoiceExcelData.data[i].caseUploaded).utc();
                                        const caseSubmitted = moment(
                                            invoiceExcelData.data[i].seniorSupervisor?.submittedDate ||
                                            invoiceExcelData.data[i].manager?.submittedDate ||
                                            invoiceExcelData.data[i].admin?.submittedDate
                                        ).utc();

                                        if (caseUploaded.isValid() && caseSubmitted.isValid()) {
                                            const duration = moment.duration(caseSubmitted.diff(caseUploaded));
                                            const hours = duration.asHours();
                                            return hours.toFixed(2)
                                        } else {
                                            return 'Na';
                                        }
                                    })(),
                                tat: invoiceExcelData.data[i].businessHrs ? (function () {
                                    if (invoiceExcelData.data[i].distance >= 0 && invoiceExcelData.data[i].distance <= 25 && invoiceExcelData.data[i].businessHrs <= 4) {
                                        return 'within';
                                    } else if (invoiceExcelData.data[i].distance >= 26 && invoiceExcelData.data[i].businessHrs <= 8) {
                                        return 'within';
                                    } else {
                                        return 'out of Tat';
                                    }
                                })() :
                                    (function () {
                                        const caseUploaded = moment(invoiceExcelData.data[i].caseUploaded).utc();
                                        const caseSubmitted = moment(
                                            invoiceExcelData.data[i].seniorSupervisor?.submittedDate ||
                                            invoiceExcelData.data[i].manager?.submittedDate ||
                                            invoiceExcelData.data[i].admin?.submittedDate
                                        ).utc();

                                        if (caseUploaded.isValid() && caseSubmitted.isValid()) {
                                            const duration = moment.duration(caseSubmitted.diff(caseUploaded));
                                            const hours = duration.asHours();

                                            if (invoiceExcelData.data[i].distance >= 0 && invoiceExcelData.data[i].distance <= 25 && hours <= 4) {
                                                return 'within';
                                            } else if (invoiceExcelData.data[i].distance >= 26 && hours <= 8) {
                                                return 'within';
                                            } else {
                                                return 'out of Tat';
                                            }
                                        } else {
                                            return "Na";
                                        }
                                    })(),
                                oglOrWithin: invoiceExcelData.data[i].oglOrWithin || "Na",
                                action: `<div> 
                                            <button class="btn w-35px h-35px mr-1 btn-warning text-uppercase btn-sm" data-toggle="tooltip" title="Edit" data-uniqueId="${invoiceExcelData.data[i].uniqueId}" data-id="${invoiceExcelData.data[i]._id}" data-bank="${invoiceExcelData.data[i].bank}" data-km="${invoiceExcelData.data[i].distance}" data-original-title="Delete">
                                                <i class="fas fa-pencil"></i>
                                            </button> 
                                            <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/invoice/deleteInvoiceExcelData/${invoiceExcelData.data[i]._id}/${req.body.id}/${invoiceExcelFormat}" data-original-title="Delete">
                                                <i class="far fa-trash-alt"></i> 
                                            </a>    
                                        </div>`,
                            });
                            count++;
                        }
                        break;
                    case "hdfc_format":
                        for (let i = 0; i < invoiceExcelData.data.length; i++) {
                            let fiToBeConducted = '';

                            if (invoiceExcelData.data[i].rv?.address) fiToBeConducted += 'rv,';
                            if (invoiceExcelData.data[i].pv?.address) fiToBeConducted += 'pv,';
                            if (invoiceExcelData.data[i].bv?.address) fiToBeConducted += 'bv';
                            data.push({
                                count: count,
                                applicationId: invoiceExcelData.data[i].fileNo,
                                customerName: invoiceExcelData.data[i].applicantName,
                                fiToBeConducted: fiToBeConducted,
                                product: invoiceExcelData.data[i].product,
                                rv: invoiceExcelData.data[i]?.rv?.address,
                                bv: invoiceExcelData.data[i]?.bv?.address,
                                pv: invoiceExcelData.data[i]?.pv?.address,
                                date: invoiceExcelData.data[i].date,
                                area: invoiceExcelData.data[i].area,
                                rvKm: invoiceExcelData.data[i].addresstype === 'PV' ? invoiceExcelData.data[i]?.pv?.distance : invoiceExcelData.data[i]?.rv?.distance || 0,
                                branch: invoiceExcelData.data[i].branch,
                                status: invoiceExcelData.data[i].caseStatus,
                                point: invoiceExcelData.data[i].point,
                                bvKm: invoiceExcelData.data[i]?.bv?.distance || 0,
                                rate: invoiceExcelData.data[i].rate,
                                resiRemark: invoiceExcelData.data[i].rv?.remark || "Na",
                                officeRemark: invoiceExcelData.data[i].bv?.remark || "Na",
                                remark: invoiceExcelData.data[i].remarks,
                                cpvBy: invoiceExcelData.data[i].cpvBy || "Na",
                                action: `<div> 
                                            <button class="btn w-35px h-35px mr-1 btn-warning text-uppercase btn-sm" data-toggle="tooltip" title="Edit" data-uniqueId="${invoiceExcelData.data[i].uniqueId}" data-id="${invoiceExcelData.data[i]._id}" data-bank="${invoiceExcelData.data[i].bank}" data-km="${invoiceExcelData.data[i].distance}" data-addressType="${invoiceExcelData.data[i].addressType}" data-original-title="Delete">
                                            <i class="fas fa-pencil"></i>
                                             </button> 
                                            <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/invoice/deleteBankDetails/${invoiceExcelData.data[i]._id}" data-original-title="Delete">
                                                <i class="far fa-trash-alt"></i> 
                                            </a>    
                                        </div>`,
                            });
                            count++;
                        }
                        break;
                    default:
                        break;
                };

                if (data.length === invoiceExcelData.data.length) {
                    let jsonData = JSON.stringify({
                        draw: parseInt(req.body.draw),
                        recordsTotal: invoiceExcelData.sum1.sum,
                        recordsFiltered: invoiceExcelData.sum2.sum,
                        data,
                    });
                    res.send(jsonData);
                }
            } else {
                let jsonData = JSON.stringify({
                    draw: parseInt(req.body.draw),
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data,
                });
                res.send(jsonData);
            }

        } catch (error) {
            next(error);
        }
    };

    public editInvoiceExcelData = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { uniqueId, bank, product, km, area, branch, oglOrWithin, status, point, invoiceExcelFormat, agencyName, branchId, businessBranch, businessHrs, conveyance, pv, rv, bv } = req.body;

            const [allowDeleteInvoiceData, allowDeleteInvoice] = await Promise.all([
                this.invoiceService.getInvoiceDataExcel({ status: 'processing', uniqueId }),
                this.invoiceService.getInvoice({ status: 'processing', uniqueId })
            ]);

            if (allowDeleteInvoiceData || allowDeleteInvoice) {
                req.flash('error', 'Kindly wait, other files are processing');
                return res.send("success");
            }


            const { id } = req.params;
            let data
            switch (invoiceExcelFormat) {
                case 'common_format':
                    data = {
                        distance: km,
                        branch: branch.toUpperCase(),
                        area: area.toUpperCase(),
                        caseStatus: status.toUpperCase(),
                        point,
                    };
                    break;
                case 'bandhan_format':
                    data = {
                        tat: "Na",
                        businessHrs,
                        agencyName,
                        caseStatus: status.toUpperCase(),
                        point,
                        branchId,
                        businessBranch,
                        distance: km,
                        oglOrWithin,
                        area: area.toUpperCase()
                    };
                    if (km >= 0 && km <= 25 && businessHrs <= 4) {
                        data.tat = 'within'
                    } else if (km >= 26 && businessHrs <= 8) {
                        data.tat = 'within'
                    } else {
                        data.tat = 'out of Tat';
                    }
                    break;
                case 'csl_format':
                    data = {
                        distance: km,
                        area: area.toUpperCase(),
                        caseStatus: status.toUpperCase(),
                        point,
                    };
                    if (parseInt(km) > 30 && parseInt(km) <= 50) {
                        data.conveyance = {
                            distance: parseInt(km) - 30,
                            cost: parseInt(conveyance) * (parseInt(km) - 30)
                        }
                    } else {
                        data.conveyance = {
                            distance: 0,
                            cost: 0
                        }
                    }
                    break;
                case 'hdfc_format':
                    data = {
                        distance: km,
                        branch: branch.toUpperCase(),
                        area: area.toUpperCase(),
                        caseStatus: status.toUpperCase(),
                        point,
                    };
                    pv?.address && (data.pv = pv);
                    bv?.address && (data.bv = bv);
                    rv?.address && (data.rv = rv);
                    break;
                default:
                    break;
            }
            const cond = { product, area, bank, point, from: { $lte: parseInt(km) }, to: { $gte: parseInt(km) } }

            const rateData = await this.invoiceService.getRate(cond);
            if (!rateData) {
                req.flash("error", 'no matching rate found');
                res.send("success");
            } else {
                data.rate = rateData.rate;
                const { code, message } = await this.invoiceService.updateInvoiceExcelData(id, data);
                req.flash(code === 401 ? "error" : "success", code === 401 ? message : "updated successfully");
                res.send("success");
            }
        } catch (error) {
            next(error)
        }
    };

    public deleteInvoiceExcelData = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { id, uniqueId, invoiceExcelFormat, conveyance } = req.params
            const [allowDeleteInvoiceData, allowDeleteInvoice] = await Promise.all([
                this.invoiceService.getInvoiceDataExcel({ status: 'processing', uniqueId }),
                this.invoiceService.getInvoice({ status: 'processing', uniqueId })
            ]);

            if (allowDeleteInvoiceData || allowDeleteInvoice) {
                req.flash('error', 'Kindly wait, other files are processing');
                return res.redirect(`/invoice/invoiceExcelData/${uniqueId}/${invoiceExcelFormat}${conveyance ? '/' + conveyance : ''}`);
            }


            const { code, message } = await this.invoiceService.deleteInvoiceExcelData(id);
            req.flash(code === 401 ? "error" : "success", code === 401 ? message : "deleted successfully");
            res.redirect(`/invoice/invoiceExcelData/${uniqueId}/${invoiceExcelFormat}${conveyance ? '/' + conveyance : ''}`);
        } catch (error) {
            next(error)
        }
    };


    // **************************************** invoice data excel status ***************************
    public createInvoiceDataExcel = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { invoiceExcelFormat, uniqueId } = req.params;
            createInvoiceDataExcel(invoiceExcelFormat, uniqueId);
            res.redirect("/invoice/invoiceDataExcelStatus");
        } catch (error) {
            next(error)
        }
    };

    public invoiceDataExcelStatus = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { role, email } = req.user;
            res.locals.message = req.flash();
            res.render("invoice/invoices/invoiceDataExcelStatus/invoiceDataExcelStatusDataTable.ejs", { role, email });
        } catch (error) {
            next(error)
        }
    };

    public invoiceDataExcelStatusDataTable = async (req: any, res: Response, next: NextFunction) => {
        try {
            let searchArray = await invoiceExcelDataStatusSearch(req.body.columns);

            let data: any = [];
            const [invoiceDataExcel] = await this.invoiceService.getAllInvoiceDataExcelStatusList(req, searchArray)
            let count = parseInt(req.body.start) + 1;
            if (invoiceDataExcel) {
                for (let i = 0; i < invoiceDataExcel.data.length; i++) {
                    data.push({
                        count: count,
                        name: invoiceDataExcel.data[i].name,
                        status: invoiceDataExcel.data[i].status,
                        invoiceExcelFormat: invoiceDataExcel.data[i].invoiceExcelFormat,
                        error: invoiceDataExcel.data[i].error || 'NA',
                        action: `<div>
                                    ${invoiceDataExcel.data[i].status === 'success' ? `<a class="btn w-35px h-35px mr-1 btn-green text-uppercase btn-sm" data-toggle="tooltip" title="Download" href=${process.env.BASE_URL}${invoiceDataExcel.data[i].fileUrl} data-original-title="Download">
                                    <i class="fa-solid fa-file-excel"></i>
                                    </a>`: ''}  
                                    ${['success', 'failed'].includes(invoiceDataExcel.data[i].status) ? `<a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" href="/invoice/deleteInvoiceExcelFile/${invoiceDataExcel.data[i]._id}" data-original-title="Delete">
                                    <i class="far fa-trash-alt"></i> 
                                </a>`: ''}  
                                </div>`,
                    });
                    count++;
                }

                if (data.length === invoiceDataExcel.data.length) {
                    let jsonData = JSON.stringify({
                        draw: parseInt(req.body.draw),
                        recordsTotal: invoiceDataExcel.sum1.sum,
                        recordsFiltered: invoiceDataExcel.sum2.sum,
                        data,
                    });
                    res.send(jsonData);
                }
            } else {
                let jsonData = JSON.stringify({
                    draw: parseInt(req.body.draw),
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data,
                });
                res.send(jsonData);
            }

        } catch (error) {
            next(error);
        }
    };

    public deleteInvoiceExcelFile = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const { id } = req.params;
                let deleteStatus = ""
                const file: any = await this.invoiceService.getInvoiceDataExcel({ _id: id });

                fs.access(path.join(__dirname, '../../public', file.fileUrl), fs.constants.F_OK, async (err) => {
                    if (err) {
                        await this.invoiceService.deleteExcelFile(id);
                        deleteStatus = 'error';
                    } else {
                        fs.unlink(path.join(__dirname, '../../public', file.fileUrl), async (deleteErr) => {
                            if (deleteErr) {
                                deleteStatus = 'error';
                            } else {
                                await this.invoiceService.deleteExcelFile(id);
                                deleteStatus = 'success';
                            }
                        });
                    }
                });

                deleteStatus === 'error' ? req.flash('error', 'File deletion failed') : req.flash('success', 'File deleted successfully');
                res.redirect("/invoice/invoiceDataExcelStatus");
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/invoice/invoiceDataExcelStatus")
            }
        } catch (error) {
            next(error)
        }
    };


    // ***************************** create invoice *******************************************
    public createInvoice = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const [invoiceCred] = await this.invoiceService.getInvoiceDataExcelAggregate(id);

            let fileUrl = path.join(__dirname, "../../public/invoices/");

            const fileName = `${invoiceCred.data.invoiceFormat}_${Date.now()}.xlsx`;
            const newFileUrl = `${fileUrl}invoice_files/${fileName}`;
            const databaseFileUrl = `/invoices/invoice_files/${fileName}`;
            const dataObj = {
                name: fileName,
                bank: invoiceCred.data.bank,
                invoiceToId: invoiceCred.data.invoiceTo[0]._id,
                invoiceFromId: invoiceCred.data.invoiceFrom[0]._id,
                bankDetailsId: invoiceCred.data.bankDetails[0]._id,
                fileUrl: databaseFileUrl,
                uniqueId: invoiceCred.uniqueId,
                invoiceFormat: invoiceCred.data.invoiceFormat,
                invoiceExcelFormat: invoiceCred.data.invoiceExcelFormat,
                dateTo: invoiceCred.data.dateTo,
                dateFrom: invoiceCred.data.dateFrom,
                status: 'processing',
            };

            const addFile = await this.invoiceService.createInvoice(dataObj);
            if (addFile.code === 401) {
                req.flash('error', addFile.message);
                return res.redirect("/invoice/invoiceExcelDataStatus");
            } else {
                createInvoice(addFile._id, invoiceCred, fileUrl, newFileUrl);
                req.flash('success', 'created successfully')
                res.redirect("/invoice/invoiceList");
            }
        } catch (error) {
            req.flash('error', error.message)
            res.redirect("/invoice/invoiceList");
        }
    };

    public deleteInvoice = async (req: any, res: Response, next: NextFunction) => {
        try {
            if (req.user.role == "admin") {
                const { id } = req.params;
                let deleteStatus = ""
                const file: any = await this.invoiceService.getInvoice({ _id: id });

                fs.access(path.join(__dirname, '../../public', file.fileUrl), fs.constants.F_OK, async (err) => {
                    if (err) {
                        await this.invoiceService.deleteInvoice(id);
                        deleteStatus = 'error';
                    } else {
                        fs.unlink(path.join(__dirname, '../../public', file.fileUrl), async (deleteErr) => {
                            if (deleteErr) {
                                deleteStatus = 'error';
                            } else {
                                await this.invoiceService.deleteInvoice(id);
                                deleteStatus = 'success';
                            }
                        });
                    }
                });

                deleteStatus === 'error' ? req.flash('error', 'invoice deletion failed') : req.flash('success', 'invoice deleted successfully');
                res.redirect("/invoice/invoiceList");
            } else {
                req.flash("error", "Access Denied")
                res.redirect("/invoice/invoiceList");
            }
        } catch (error) {
            next(error)
        }
    };
}

export default invoiceController;