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
        console.log("errors>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", errors)
        if (errors) return ajax ? res.send({ err: errors.message }) : (req.flash('error', errors.message), res.redirect(path(req)));
        next();
    } catch (error) {
        next(error);
    }
};

// ***************************** INVOICE FROM *************************************************

const getInvoiceFromList: JoiMiddlewareSchema = {
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true)
};

const postInvoiceFromDataTable: JoiMiddlewareSchema = {
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
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
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
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
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true)
};

const getEditInvoiceFrom: JoiMiddlewareSchema = {
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
};

const postSubmitEditInvoiceFrom: JoiMiddlewareSchema = {
    ...postSubmitAddInvoiceFrom,
    params: Joi.object().keys({
        id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    })
};

const getDeleteInvoiceFrom: JoiMiddlewareSchema = {
    params: postSubmitEditInvoiceFrom.params,
    cookies: postSubmitAddInvoiceFrom.cookies,
};

// ******************************************* INVOICE TO *******************************************

const getInvoiceToList: JoiMiddlewareSchema = {
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
};

const postInvoiceToDataTable: JoiMiddlewareSchema = {
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
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
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
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
    cookies: postSubmitAddInvoiceFrom.cookies,
};

const getEditInvoiceTo: JoiMiddlewareSchema = {
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
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
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true)
};

const postBankDetailsDataTable: JoiMiddlewareSchema = {
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
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
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
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
    cookies: postSubmitAddInvoiceFrom.cookies,
};

const getEditBankDetails: JoiMiddlewareSchema = {
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
};

const postSubmitEditBankDetails: JoiMiddlewareSchema = {
    ...postSubmitAddBankDetails,
    params: postSubmitEditInvoiceFrom.params,
};

const getDeleteBankDetails: JoiMiddlewareSchema = {
    ...getDeleteInvoiceFrom
};

// ********************************RATE ****************************************************************


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
    cookies: postSubmitAddInvoiceFrom.cookies,
};

const postEditRate: JoiMiddlewareSchema = {
    body: Joi.object().keys({
        bank: Joi.string().required(),
        area: Joi.string().required(),
        product: Joi.string().required(),
        from: Joi.string().required(),
        to: Joi.string().required(),
        point: Joi.string().required(),
        rate: Joi.string().required(),
    }),
    params: postSubmitEditInvoiceFrom.params,
};

const getDeleteRate: JoiMiddlewareSchema = {
    ...getDeleteInvoiceFrom
};

// *************************************** INVOICE **************************************

const getInvoiceList: JoiMiddlewareSchema = {
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true)
};

const postInvoiceListDataTable: JoiMiddlewareSchema = {
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
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
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
};

const getCreateInvoice: JoiMiddlewareSchema = {
    ...getDeleteInvoiceFrom
};

const postAddInvoiceSubmit: JoiMiddlewareSchema = {
    body: Joi.object().keys({
        bank: Joi.string().required(),
        area: Joi.string().required(),
        product: Joi.string().required(),
        from: Joi.string().required(),
        to: Joi.string().required(),
        point: Joi.string().required(),
        rate: Joi.string().required(),
        invoiceFormat: Joi.string().required(),
        invoiceExcelFormat: Joi.string().required(),
        invoiceToTemplate: Joi.string().required(),
        invoiceFromTemplate: Joi.string().required(),
        bankDetailsTemplate: Joi.string().required(),
        min: Joi.string().required(),
        max: Joi.string().required(),
        conveyance: Joi.string().required(),
    }),
    cookies: postSubmitAddInvoiceFrom.cookies,
};


// ************************************ invoice excel data status ******************************************

const getInvoiceExcelDataStatus: JoiMiddlewareSchema = {
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true)
};

const postInvoiceExcelDataStatusDataTable: JoiMiddlewareSchema = {
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
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
    cookies: postSubmitAddInvoiceFrom.cookies,
};

// ************************************** invoice excel data **********************************************
const getInvoiceExcelData: JoiMiddlewareSchema = {
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
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
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
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
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    body: Joi.object().keys({
        invoiceExcelFormat: Joi.string().required(),
        id: Joi.string().required(),
        product: Joi.string().required(),
        area: Joi.string().required(),
        bank: Joi.string().required(),
        point: Joi.string().required(),
        km: Joi.string().required(),
        status: Joi.string().required(),
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
            otherwise: Joi.forbidden(), // This field is forbidden for other values
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
    cookies: Joi.object().keys({
        jwtToken: Joi.string().required(),
    }).unknown(true),
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
    postAddRate,
    postEditRate,
    getDeleteRate,
    postAddInvoiceSubmit,
    getInvoiceList,
    postInvoiceListDataTable,
    getAddInvoice,
    getCreateInvoice,
    getInvoiceExcelDataStatus,
    postInvoiceExcelDataStatusDataTable,
    getDeleteInvoiceExcelDataStatus,
    getInvoiceExcelData,
    postInvoiceExcelDataDataTable,
    postEditInvoiceExcelData,
    getDeleteInvoiceExcelData
};

export { validate, schemas };
