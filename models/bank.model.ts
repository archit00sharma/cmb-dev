import { model, Schema, Document } from "mongoose";
import { bank } from "../interfaces/bank.interface";

const bankSchema: Schema = new Schema(
    {
        bank: {
            type: String,
            default: "",
            unique: true, trim: true,uppercase:true,index:true
        },

    }, {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    }
);

const bankModel = model<bank>("Bank", bankSchema);
export default bankModel;
