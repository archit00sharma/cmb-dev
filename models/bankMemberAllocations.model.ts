import { model, Schema, Document } from "mongoose";
import { bankMemberAllocation } from "../interfaces/bankMemberAllocation.interface";


const bankMemberAllocationSchema: Schema = new Schema(
    {

        product: {
            type: String,
            required: true,
            index: true,
            trim: true,

        },
        bank: {
            type: String,
            required: true,
            trim: true,
            index: true,

        },
        user_id: {
            type: Schema.Types.ObjectId,
            required: true,
            trim: true,
            index: true
        }


    }, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
}
);

bankMemberAllocationSchema.index({ user_id: 1, bank: 1, product: 1 }, { unique: true })
const bankMemberAllocationModel = model<bankMemberAllocation>("BankMemberAllocation", bankMemberAllocationSchema);

export default bankMemberAllocationModel;