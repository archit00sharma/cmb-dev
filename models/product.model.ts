import mongoose, { model, Schema, Document } from "mongoose";
import { product } from "../interfaces/product.interface";

const productSchema: Schema = new Schema(
    {
        product: {
            type: String,
            trim: true,
            unique: true,
            uppercase:true,index:true
        },

    }, {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    }
);

const productModel = model<product>("Product", productSchema);
export default productModel;
