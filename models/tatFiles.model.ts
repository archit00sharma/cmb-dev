import { fieldExecutive } from '../interfaces/fieldExecutive.interface';
import mongoose, { model, Schema, Document } from "mongoose";
import { tatFile } from "../interfaces/tatFile.interface";


const tatFileSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            unique: true,
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
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
}
);



const tatFileModel = model<tatFile>("tatFile", tatFileSchema);

export default tatFileModel;

