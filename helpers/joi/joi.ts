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

const validate = (schema: JoiMiddlewareSchema) => (req: any, res: Response, next: NextFunction) => {
    try {
        const validatePart = (data: any, validationSchema: ObjectSchema | undefined) => {
            const { error } = validationSchema?.validate(data) || {};
            return error;
        };

        const parts = ['headers', 'body', 'query', 'params', 'cookies'];
        const [errors]: ValidationError[] = parts.filter((part) => schema[part as keyof JoiMiddlewareSchema]).map((part) => validatePart(req[part], schema[part as keyof JoiMiddlewareSchema])).filter((error) => error);

        if (errors) req.joiError = errors.message;

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

const postSubmitAddInvoiceTo: JoiMiddlewareSchema = {
    body: Joi.object().keys({
        templateName: Joi.string().required(),
        placeOfSupply: Joi.string().required(),
        companyName: Joi.string().required(),
        address: Joi.string().required(),
        pan: Joi.string().required(),
        gstNumber: Joi.string().required(),
        sacNumber: Joi.string().required(),
        state: Joi.string().required(),
        stateCode: Joi.string().required(),
        serviceCategory: Joi.string().required(),
        email: Joi.string().email().required(),
    }),
    cookies: postSubmitAddInvoiceFrom.cookies,
};

const postSubmitEditInvoiceTo: JoiMiddlewareSchema = {
    ...postSubmitAddInvoiceTo,
    params: postSubmitEditInvoiceFrom.params,
};

const getDeleteInvoiceTo: JoiMiddlewareSchema = {
    ...getDeleteInvoiceFrom
};


// ************************************************ BANK DETAILS********************************************
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


const schemas: any = {
    getInvoiceFromList,
    postInvoiceFromDataTable,
    getAddInvoiceFrom,
    postSubmitAddInvoiceFrom,
    postSubmitEditInvoiceFrom,
    getDeleteInvoiceFrom,
    postSubmitAddInvoiceTo,
    postSubmitEditInvoiceTo,
    getDeleteInvoiceTo,
    postSubmitAddBankDetails,
    postSubmitEditBankDetails,
    getDeleteBankDetails,
    postAddRate,
    postEditRate,
    getDeleteRate,
    postAddInvoiceSubmit,
    getCreateInvoice,
};

export { validate, schemas };
