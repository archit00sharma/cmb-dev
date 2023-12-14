import { model, Schema } from "mongoose";



const invoiceFromSchema: Schema = new Schema(
    {
        templateName: {
            type: String,
            required: true
        },
        companyName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        pan: {
            type: String,
            required: true
        },
        gstNumber: {
            type: String,
            required: true
        },
        gstRegistrationState: {
            type: String,
            required: true
        },
        reverseCharge: {
            type: String,
            required: true
        },
        serviceCategory: {
            type: String,
            required: true
        },
        iboxId: {
            type: String,
            required: true
        },
        regdNo: {
            type: String,
            required: true
        },
        cin: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        agencyCode: {
            type: String,
            required: true
        },
        ifscNumber: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        stateCode: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            required: true
        },
        accountNo: {
            type: String,
            required: true
        },
        hsnSac: {
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