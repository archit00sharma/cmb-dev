import { ArrayContains } from "class-validator";
import { model, Schema, Document } from "mongoose";
import { fieldExecutive } from "../../interfaces/fieldExecutive.interface";


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
        case: {
            type: Array,
            trim: true,
            default: []
        },
        addedBy: {
            type: String,
            trim: true,
            default: "admin"
        },
        cordinates: {
            type: Array,
            trim: true,
        },
        isDeleted: {
            type: Boolean,
            trim: true,
            index: true
        },
        fireBaseToken: {
            type: String
        },
        submittedCases: {
            type: Array
        },
        token: {
            type: String
        }

    }, 
);


const archieveFieldExecutiveModel = model<fieldExecutive>("archieveFieldExecutive", fieldExecutiveSchema);

export default archieveFieldExecutiveModel;