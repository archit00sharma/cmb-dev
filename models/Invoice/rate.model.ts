
import mongoose, { model, Schema } from "mongoose";



const rateSchema: Schema = new Schema(
    {
        bank: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        product: {
            type: String,
            required: true
        },
        from: {
            type: Number,
            required: true,
        },
        to: {
            type: Number,
            required: true,
        },
        point: {
            type: Number,
            required: true,
            enum: [0, 1, 2]
        },
        rate: {
            type: Number,
            required: true,
        }

    }, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}
);

rateSchema.index({ bank: 1, area: 1, product: 1, from: 1, to: 1, point: 1, }, { unique: true })
const rateModel = model("Rate", rateSchema);

export default rateModel;