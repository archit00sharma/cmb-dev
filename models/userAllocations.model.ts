import { model, Schema, Document } from "mongoose";
import { userAllocation } from "../interfaces/userAllocation.interface";


const userAllocationSchema: Schema = new Schema(
    {
        area: {
            type: String,
            trim: true,
            index: true,
            required: true,

        },
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
        role: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        default:{
            type: Boolean,
            required: true,
            index: true,
            default: false,
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

userAllocationSchema.index(
    {
      role: 1,
      bank: 1,
      product: 1,
      area: 1,
    },
    {
      unique: true,
      partialFilterExpression: { default: true }, // Only consider documents with default=true for uniqueness
    }
  );
const userAllocationModel = model<userAllocation>("UserAllocation", userAllocationSchema);

export default userAllocationModel;