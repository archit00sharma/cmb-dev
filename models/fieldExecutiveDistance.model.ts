import { fieldExecutive } from '../interfaces/fieldExecutive.interface';
import mongoose, { model, Schema, Document } from "mongoose";
import { feDistance } from "../interfaces/feDistance.interface";


const feDistanceSchema: Schema = new Schema(
    {
        fieldExecutiveId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true
        },
        distance: {
            type: Number,
            required: true,
            index: true
        },
        date: {
            type: Date,
            index: true,
            required: true
        }
    }
);




const feDistanceModel = model<feDistance>("FeDistance", feDistanceSchema);

export default feDistanceModel;

