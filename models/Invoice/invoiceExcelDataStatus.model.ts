
import mongoose, { model, Schema, } from "mongoose";

const dataSchema = new Schema({
    product: {
        type: Array,
        required: true,
    },
    area: {
        type: Array,
        required: true,
    },
    bank: {
        type: String,
        required: true,
    },
    invoiceTo: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    invoiceFrom: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    bankDetails: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    invoiceFormat: {
        type: String,
        required: true,
    },
    invoiceExcelFormat: {
        type: String,
        required: true,
    },
    dateFrom: {
        type: Date,
        required: true,
    },
    dateTo: {
        type: Date,
        required: true,
    },
    conveyance:{
        type: Number,
    }
})


const invoiceExcelDataStatusSchema: Schema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        uniqueId: {
            type: String,
            unique: true,
            required: true,
        },
        status: {
            type: String,
            default: "processing",
            enum: ['processing', 'failed', 'success']
        },
        data: dataSchema,
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



const invoiceExcelDataStatusModel = model("InvoiceExcelDataStatus", invoiceExcelDataStatusSchema);

export default invoiceExcelDataStatusModel;

