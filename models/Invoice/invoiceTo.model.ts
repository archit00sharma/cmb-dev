import { model, Schema } from "mongoose";



const invoiceToSchema: Schema = new Schema(
    {
        templateName: {
            type: String,
            require: true
        },
        placeOfSupply: {
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
        sac: {
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

        serviceCategory: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
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