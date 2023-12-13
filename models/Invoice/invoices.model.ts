import mongoose, { model, Schema } from "mongoose";



const invoiceSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        dateTo: {
            type: String,
            required: true
        },
        dateFrom: {
            type: String,
            required: true
        },
        invoiceFormat: {
            type: String,
            required: true
        },
        invoiceNo: {
            type: String,
            // required: true
        },
        invoiceExcelFormat: {
            type: String,
            required: true
        },
        bank: {
            type: String,
            required: true
        },
        invoiceToId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        invoiceFromId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        bankDetailsId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        fileUrl: {
            type: String,
            unique: true,
            required: true,
        },
        uniqueId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['processing', 'failed', 'success']
        },
        error: {
            type: String,
        }
    }, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}
);


const invoiceModel = model("Invoice", invoiceSchema);

export default invoiceModel;