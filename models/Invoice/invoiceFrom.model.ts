import { model, Schema } from "mongoose";



const invoiceFromSchema: Schema = new Schema(
    {
        templateName: {
            type: String,
            require: true
        },
        invoiceNo: {
            type: String,
            require: true
        },
        companyName: {
            type: String,
            require: true
        },
        address: {
            type: String,
            require: true
        },
        pan: {
            type: String,
            require: true
        },
        gstNumber: {
            type: String,
            require: true
        },
        gstRegistrationState: {
            type: String,
            require: true
        },
        reverseCharge: {
            type: String,
            require: true
        },
        serviceCategory: {
            type: String,
            require: true
        },
        iboxId: {
            type: String,
            require: true
        },
        regdNo: {
            type: String,
            require: true
        },
        cin: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        agencyCode: {
            type: String,
            require: true
        },
        ifscNumber: {
            type: String,
            require: true
        },
        state: {
            type: String,
            require: true
        },
        stateCode: {
            type: String,
            require: true
        },
        branch: {
            type: String,
            require: true
        },
        accountNo:{
            type: String,
            require: true
        },
        hsnSac:{
            type: String,
        }


    }, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
}
);


const invoiceFromModel = model("InvoiceFrom", invoiceFromSchema);

export default invoiceFromModel;