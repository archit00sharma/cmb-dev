import mongoose, { model, Schema } from "mongoose";



const invoiceSchema: Schema = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        dateTo: {
            type: String,
            require: true
        },
        dateFrom: {
            type: String,
            require: true
        },
        invoiceFormat: {
            type: String,
            require: true
        },
        invoiceNo: {
            type: String,
            require: true
        },
        invoiceExcelFormat: {
            type: String,
            require: true
        },
        bank: {
            type: String,
            require: true
        },
        invoiceToId: {
            type: mongoose.Types.ObjectId,
            require: true
        },
        invoiceFromId: {
            type: mongoose.Types.ObjectId,
            require: true
        },
        bankDetailsId: {
            type: mongoose.Types.ObjectId,
            require: true
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