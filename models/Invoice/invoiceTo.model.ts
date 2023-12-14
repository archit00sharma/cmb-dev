import { model, Schema } from "mongoose";



const invoiceToSchema: Schema = new Schema(
    {
        templateName: {
            type: String,
            required: true
        },
        placeOfSupply: {
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
        sac: {
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

        serviceCategory: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
    }, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}
);


const invoiceToModel = model("InvoiceTo", invoiceToSchema);

export default invoiceToModel;