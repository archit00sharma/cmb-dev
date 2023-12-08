import { model, Schema, Document } from "mongoose";
import { area } from "../interfaces/area.interface";


const areaSchema: Schema = new Schema(
    {
        area: {
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


const areaModel = model<area>("Area", areaSchema);

export default areaModel;

