import { model, Schema, Document } from "mongoose";
import { manager } from "../interfaces/manager.interface";


const managerSchema: Schema = new Schema(
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
        password: {
            type: String,
            trim: true,
            required: true,
        },
       
        permissions: {
            type: Array,
            trim: true,
            default: []
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
        isDeleted: {
            type: Boolean,
            trim: true,
            index: true
        },
        fireBaseToken: {
            type: Array
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

const managerModel: any = model<manager>("Manager", managerSchema);
export default managerModel;