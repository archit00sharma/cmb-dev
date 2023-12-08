import { model, Schema, Document } from "mongoose";
import { admin } from "../interfaces/admin.interface";


const adminSchema: Schema = new Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
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
            default: ["manager", "senior-supervisor", "supervisor", "field-executive"]
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


const adminModel = model<admin>("Admin", adminSchema);

export default adminModel;