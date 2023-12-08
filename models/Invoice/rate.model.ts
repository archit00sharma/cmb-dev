
import mongoose, { model, Schema } from "mongoose";



const rateSchema: Schema = new Schema(
    {
        bank: {
            type: String,
            require: true
        },
        area: {
            type: String,
            require: true
        },
        product: {
            type: String,
            require: true
        },
        from: {
            type: Number,
            require: true,
        },
        to: {
            type: Number,
            require: true,
        },
        point: {
            type: Number,
            require: true,
            enum: [0, 1, 2]
        },
        rate: {
            type: Number,
            require: true,
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