// routes/joiMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema, ValidationError } from 'joi';

interface JoiMiddlewareSchema {
    params?: ObjectSchema;
    headers?: ObjectSchema;
    body?: ObjectSchema;
    query?: ObjectSchema;
    cookies?: ObjectSchema;
}

const validate = (schema: JoiMiddlewareSchema, path?, ajax = false) => (req: any, res: Response, next: NextFunction) => {
    try {
        const validatePart = (data: any, validationSchema: ObjectSchema | undefined) => {
            const { error } = validationSchema?.validate(data) || {};
            return error;
        };
        const parts = ['headers', 'body', 'query', 'params', 'cookies'];
        const [errors]: ValidationError[] = parts.filter((part) => schema[part as keyof JoiMiddlewareSchema]).map((part) => validatePart(req[part], schema[part as keyof JoiMiddlewareSchema])).filter((error) => error);
        
        if (errors) return ajax ? res.send({ err: errors.message }) : (req.flash('error', errors.message), res.redirect(path(req)));
        next();
    } catch (error) {
        next(error);
    }
};



// ************* common parameter ******************************
const cookies = Joi.object().keys({
    jwtToken: Joi.string().required(),
}).unknown(true)




// ***************************** INVOICE FROM *************************************************

const getInvoiceFromList: JoiMiddlewareSchema = {
    cookies
};

const postInvoiceFromDataTable: JoiMiddlewareSchema = {
    cookies,
    body: Joi.object().keys({
        columns: Joi.array().required(),
        order: Joi.array().required(),
        length: Joi.string().required(),
        start: Joi.string().required(),
        search: Joi.object().required(),
        draw: Joi.string().required(),
    })
};

const getAddInvoiceFrom: JoiMiddlewareSchema = {
    cookies,
};

const postSubmitAddInvoiceFrom: JoiMiddlewareSchema = {
    body: Joi.object().keys({
        templateName: Joi.string().required(),
        companyName: Joi.string().required(),
        address: Joi.string().required(),
        pan: Joi.string().required(),
        gstNumber: Joi.string().required(),
        gstRegistrationState: Joi.string().required(),
        reverseCharge: Joi.string().required(),
        serviceCategory: Joi.string().required(),
        iboxId: Joi.string().required(),
        regdNo: Joi.string().required(),
        cin: Joi.string().required(),
        email: Joi.string().email().required(),
        agencyCode: Joi.string().required(),
        ifscNumber: Joi.string().required(),
        state: Joi.string().required(),
        stateCode: Joi.string().required(),
        branch: Joi.string().required(),
        accountNo: Joi.string().required(),
        hsnSac: Joi.string().required(),
    }),
    cookies
};

const getEditInvoiceFrom: JoiMiddlewareSchema = {
    cookies
};

const postSubmitEditInvoiceFrom: JoiMiddlewareSchema = {
    ...postSubmitAddInvoiceFrom,
    params: Joi.object().keys({
        id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    })
};

const getDeleteInvoiceFrom: JoiMiddlewareSchema = {
    params: postSubmitEditInvoiceFrom.params,
    cookies
};

// ******************************************* INVOICE TO *******************************************

const getInvoiceToList: JoiMiddlewareSchema = {
    cookies
};

const postInvoiceToDataTable: JoiMiddlewareSchema = {
    cookies,
    body: Joi.object().keys({
        columns: Joi.array().required(),
        order: Joi.array().required(),
        length: Joi.string().required(),
        start: Joi.string().required(),
        search: Joi.object().required(),
        draw: Joi.string().required(),
    })
};

const getAddInvoiceTo: JoiMiddlewareSchema = {
    cookies
};

const postSubmitAddInvoiceTo: JoiMiddlewareSchema = {
    body: Joi.object().keys({
        templateName: Joi.string().required(),
        placeOfSupply: Joi.string().required(),
        companyName: Joi.string().required(),
        address: Joi.string().required(),
        pan: Joi.string().required(),
        gstNumber: Joi.string().required(),
        sac: Joi.string().required(),
        state: Joi.string().required(),
        stateCode: Joi.string().required(),
        serviceCategory: Joi.string().required(),
        email: Joi.string().email().required(),
    }),
    cookies
};

const getEditInvoiceTo: JoiMiddlewareSchema = {
    cookies
};

const postSubmitEditInvoiceTo: JoiMiddlewareSchema = {
    ...postSubmitAddInvoiceTo,
    params: postSubmitEditInvoiceFrom.params,
};

const getDeleteInvoiceTo: JoiMiddlewareSchema = {
    ...getDeleteInvoiceFrom
};


// ************************************************ BANK DETAILS********************************************
const getBankDetailsList: JoiMiddlewareSchema = {
    cookies
};

const postBankDetailsDataTable: JoiMiddlewareSchema = {
    cookies,
    body: Joi.object().keys({
        columns: Joi.array().required(),
        order: Joi.array().required(),
        length: Joi.string().required(),
        start: Joi.string().required(),
        search: Joi.object().required(),
        draw: Joi.string().required(),
    })
};

const getAddBankDetails: JoiMiddlewareSchema = {
    cookies
};

const postSubmitAddBankDetails: JoiMiddlewareSchema = {
    body: Joi.object().keys({
        templateName: Joi.string().required(),
        bankName: Joi.string().required(),
        branch: Joi.string().required(),
        accountNo: Joi.string().required(),
        rtgsCode: Joi.string().required(),
        ifscCode: Joi.string().required(),
        accountHolderName: Joi.string().required(),
    }),
    cookies,
};

const getEditBankDetails: JoiMiddlewareSchema = {
    cookies
};

const postSubmitEditBankDetails: JoiMiddlewareSchema = {
    ...postSubmitAddBankDetails,
    params: postSubmitEditInvoiceFrom.params,
};

const getDeleteBankDetails: JoiMiddlewareSchema = {
    ...getDeleteInvoiceFrom
};

// ********************************RATE ****************************************************************
const getRateList: JoiMiddlewareSchema = {
    cookies
};

const postRateListDataTable: JoiMiddlewareSchema = {
    cookies,
    body: Joi.object().keys({
        columns: Joi.array().required(),
        order: Joi.array().required(),
        length: Joi.string().required(),
        start: Joi.string().required(),
        search: Joi.object().required(),
        draw: Joi.string().required(),
    })
};

const postAddRate: JoiMiddlewareSchema = {
    body: Joi.object().keys({
        bank: Joi.string().required(),
        area: Joi.array().required(),
        product: Joi.array().required(),
        from: Joi.string().required(),
        to: Joi.string().required(),
        point: Joi.string().required(),
        rate: Joi.string().required(),
    }),
    cookies
};

const postEditRate: JoiMiddlewareSchema = {
    body: Joi.object().keys({
        rate: Joi.string().required(),
    }),
    params: postSubmitEditInvoiceFrom.params,
};

const getDeleteRate: JoiMiddlewareSchema = {
    ...getDeleteInvoiceFrom
};

// *************************************** INVOICE **************************************

const getInvoiceList: JoiMiddlewareSchema = {
    cookies
};

const postInvoiceListDataTable: JoiMiddlewareSchema = {
    cookies,
    body: Joi.object().keys({
        columns: Joi.array().required(),
        order: Joi.array().required(),
        length: Joi.string().required(),
        start: Joi.string().required(),
        search: Joi.object().required(),
        draw: Joi.string().required(),
    })
};

const getAddInvoice: JoiMiddlewareSchema = {
    cookies,
};

const getCreateInvoice: JoiMiddlewareSchema = {
    ...getDeleteInvoiceFrom
};

const postAddInvoiceSubmit: JoiMiddlewareSchema = {
    body: Joi.object().keys({
        bank: Joi.string().required(),
        area: Joi.string().required(),
        product: Joi.array().required(),
        invoiceFormat: Joi.string().required(),
        invoiceExcelFormat: Joi.string().required(),
        invoiceToTemplate: Joi.string().required(),
        invoiceFromTemplate: Joi.string().required(),
        bankDetailsTemplate: Joi.string().required(),
        min: Joi.string().required(),
        max: Joi.string().required(),
        conveyance: Joi.when('invoiceExcelFormat', {
            is: ['csl_format'],
            then: Joi.string().required(),
            otherwise: Joi.optional().allow(null),
        })
    }),
    cookies,
};

const getDeleteInvoice: JoiMiddlewareSchema = {
    cookies,
    params: Joi.object().keys({
        id: Joi.string().required(),
    })
};


// ************************************ invoice excel data status ******************************************

const getInvoiceExcelDataStatus: JoiMiddlewareSchema = {
    cookies,
};

const postInvoiceExcelDataStatusDataTable: JoiMiddlewareSchema = {
    cookies,
    body: Joi.object().keys({
        columns: Joi.array().required(),
        order: Joi.array().required(),
        length: Joi.string().required(),
        start: Joi.string().required(),
        search: Joi.object().required(),
        draw: Joi.string().required(),
    })
};

const getDeleteInvoiceExcelDataStatus: JoiMiddlewareSchema = {
    params: Joi.object().keys({
        id: Joi.string().required(),
        uniqueId: Joi.string().required(),
    }),
    cookies
};

// ************************************** invoice excel data **********************************************
const getInvoiceExcelData: JoiMiddlewareSchema = {
    cookies,
    params: Joi.object().keys({
        id: Joi.string().required(),
        invoiceExcelFormat: Joi.string().required(),
        conveyance: Joi.string().when('invoiceExcelFormat', {
            is: 'csl_format',
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
    }),
};

const postInvoiceExcelDataDataTable: JoiMiddlewareSchema = {
    cookies,
    body: Joi.object().keys({
        columns: Joi.array().required(),
        order: Joi.array().required(),
        length: Joi.string().required(),
        start: Joi.string().required(),
        search: Joi.object().required(),
        draw: Joi.string().required(),
        invoiceExcelFormat: Joi.string().required(),
        id: Joi.string().required(),
    })
};

const postEditInvoiceExcelData: JoiMiddlewareSchema = {
    cookies,
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    body: Joi.object().keys({
        invoiceExcelFormat: Joi.string().required(),
        product: Joi.string().required(),
        area: Joi.string().required(),
        bank: Joi.string().required(),
        point: Joi.string().required(),
        km: Joi.string().required(),
        status: Joi.string().required(),
        conveyance: Joi.string().when('invoiceExcelFormat', {
            is: 'csl_format',
            then: Joi.string().required(),
            otherwise: Joi.forbidden(), // This field is forbidden for other values
        }),
        branch: Joi.string().when('invoiceExcelFormat', {
            is: ['common_format', 'hdfc_format'],
            then: Joi.string().required(),
            otherwise: Joi.forbidden(), // This field is forbidden for other values
        }),
        businessHrs: Joi.string().when('invoiceExcelFormat', {
            is: 'bandhan_format',
            then: Joi.string().required(),
            otherwise: Joi.forbidden(), // This field is forbidden for other values
        }),
        agencyName: Joi.string().when('invoiceExcelFormat', {
            is: 'bandhan_format',
            then: Joi.string().required(),
            otherwise: Joi.forbidden(), // This field is forbidden for other values
        }),
        branchId: Joi.string().when('invoiceExcelFormat', {
            is: 'bandhan_format',
            then: Joi.string().required(),
            otherwise: Joi.forbidden(), // This field is forbidden for other values
        }),
        businessBranch: Joi.when('invoiceExcelFormat', {
            is: 'bandhan_format',
            then: Joi.string().required(),
            otherwise: Joi.forbidden(), // This field is forbidden for other values
        }),
        pv: Joi.when('invoiceExcelFormat', {
            is: 'hdfc_format',
            then: Joi.object().keys({
                address: Joi.string().required(),
                remark: Joi.string().required(),
                distance: Joi.string().required(),
            }).optional(),
            otherwise: Joi.forbidden(), // This field is forbidden for other values
        }),
        rv: Joi.when('invoiceExcelFormat', {
            is: 'hdfc_format',
            then: Joi.object().keys({
                address: Joi.string().required(),
                remark: Joi.string().required(),
                distance: Joi.string().required(),
            }).optional(),
            otherwise: Joi.forbidden(),
        }),
        bv: Joi.when('invoiceExcelFormat', {
            is: 'hdfc_format',
            then: Joi.object().keys({
                address: Joi.string().required(),
                remark: Joi.string().required(),
                distance: Joi.string().required(),
            }).optional(),
            otherwise: Joi.forbidden(), // This field is forbidden for other values
        }),
    })
};

const getDeleteInvoiceExcelData: JoiMiddlewareSchema = {
    cookies,
    params: Joi.object().keys({
        id: Joi.string().required(),
        invoiceExcelFormat: Joi.string().required(),
        uniqueId: Joi.string().required(),
        conveyance: Joi.when('invoiceExcelFormat', {
            is: 'csl_format',
            then: Joi.string().required(),
            otherwise: Joi.forbidden(),
        }),
    }),
};

// ************************************* invoice data excel- excel **************************************

const getCreateInvoiceDataExcel: JoiMiddlewareSchema = {
    cookies,
    params: Joi.object().keys({
        uniqueId: Joi.string().required(),
        invoiceExcelFormat: Joi.string().required(),
    }),
};

const getInvoiceDataExcelStatus: JoiMiddlewareSchema = {
    cookies,
};

const postInvoiceDataExcelStatusDataTable: JoiMiddlewareSchema = {
    cookies,
    body: Joi.object().keys({
        columns: Joi.array().required(),
        order: Joi.array().required(),
        length: Joi.string().required(),
        start: Joi.string().required(),
        search: Joi.object().required(),
        draw: Joi.string().required(),
    })
};

const getDeleteInvoiceExcelFile: JoiMiddlewareSchema = {
    cookies,
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
};



const schemas: any = {
    getInvoiceFromList,
    postInvoiceFromDataTable,
    getAddInvoiceFrom,
    postSubmitAddInvoiceFrom,
    getEditInvoiceFrom,
    postSubmitEditInvoiceFrom,
    getDeleteInvoiceFrom,
    getInvoiceToList,
    postInvoiceToDataTable,
    getAddInvoiceTo,
    postSubmitAddInvoiceTo,
    getEditInvoiceTo,
    postSubmitEditInvoiceTo,
    getDeleteInvoiceTo,
    getBankDetailsList,
    postBankDetailsDataTable,
    getAddBankDetails,
    postSubmitAddBankDetails,
    getEditBankDetails,
    postSubmitEditBankDetails,
    getDeleteBankDetails,
    getRateList,
    postRateListDataTable,
    postAddRate,
    postEditRate,
    getDeleteRate,
    postAddInvoiceSubmit,
    getInvoiceList,
    postInvoiceListDataTable,
    getAddInvoice,
    getCreateInvoice,
    getDeleteInvoice,
    getInvoiceExcelDataStatus,
    postInvoiceExcelDataStatusDataTable,
    getDeleteInvoiceExcelDataStatus,
    getCreateInvoiceDataExcel,
    getInvoiceDataExcelStatus,
    getInvoiceExcelData,
    postInvoiceExcelDataDataTable,
    postEditInvoiceExcelData,
    getDeleteInvoiceExcelData,
    postInvoiceDataExcelStatusDataTable,
    getDeleteInvoiceExcelFile
};

export { validate, schemas };
