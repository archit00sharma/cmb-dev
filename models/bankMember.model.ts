import { model, Schema, Document } from "mongoose";
import { bankMember } from "../interfaces/bankMember.interface";


const bankMemberSchema: Schema = new Schema(
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
        isDeleted: {
            type: Boolean,
            trim: true,
            index: true
        },
        token: {
            type: String
        },
        failedLoginAttempts: {
            type: Object,
            date: {
                type: Date
            },
            count: {
                type: Number
            }
        },
        isPasswordUpdated: {
            type: Boolean,
            default: true
        },
        lastLoggedIn: {
            type: Date,
            default: new Date()
        }

    }, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
}
);

const bankMemberModel: any = model<bankMember>("BankMember", bankMemberSchema);
export default bankMemberModel;