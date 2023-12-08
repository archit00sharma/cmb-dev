import { model, Schema, Document } from "mongoose";
import { seniorSupervisor } from "../interfaces/seniorSupervisors.interface";


const seniorSupervisorSchema: Schema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
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


const seniorSupervisorModel = model<seniorSupervisor>("SeniorSupervisor", seniorSupervisorSchema);

export default seniorSupervisorModel;