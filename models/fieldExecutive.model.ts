import { ArrayContains } from "class-validator";
import { model, Schema, Document } from "mongoose";
import { fieldExecutive } from "../interfaces/fieldExecutive.interface";


const fieldExecutiveSchema: Schema = new Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        profilePic: {
            type: String,
            trim: true,
        },
        mobile: {
            type: Number,
            default: 0,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
       
        panCard: {
            type: String,
            default: "",
            unique: true,
            trim: true,
        },
        aadhaarCard: {
            type: Number,
            default: 0,
            unique: true,
            trim: true,
        },
        
        addedBy: {
            type: String,
            trim: true,
            default: "admin"
        },
       
        isDeleted: {
            type: Boolean,
            trim: true,
            index: true
        },
        fireBaseToken: {
            type: String
        },
        
        token: {
            type: String
        }

    }, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
}
);


const fieldExecutiveModel = model<fieldExecutive>("FieldExecutive", fieldExecutiveSchema);

export default fieldExecutiveModel;