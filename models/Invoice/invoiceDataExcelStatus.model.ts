
import mongoose, { model, Schema, } from "mongoose";


const invoiceDataExcelStatusSchema: Schema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        fileUrl:{
            type: String,
            required: true,
        },
        uniqueId: {
            type: String,
            required: true,
        },
        invoiceExcelFormat: {
            type: String,
            enum: ['common_format', 'csl_format', 'hdfc_format', 'bandhan_format']
        },
        status: {
            type: String,
            default: "processing",
            enum: ['processing', 'failed', 'success']
        },
        error: {
            type: String,
        }

    }, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
}
);



const invoiceDataExcelStatusModel = model("InvoiceDataExcelStatus", invoiceDataExcelStatusSchema);

export default invoiceDataExcelStatusModel;

