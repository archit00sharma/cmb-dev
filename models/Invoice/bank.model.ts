import { model, Schema } from "mongoose";



const bankDetailsSchema: Schema = new Schema(
    {

        templateName: {
            type: String,
            required: true
        },
        bankName: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            required: true
        },
        accountNo: {
            type: String,
            required: true
        },
        rtgsCode: {
            type: String,
            required: true
        },
        ifscCode: {
            type: String,
            required: true
        },
        accountHolderName: {
            type: String,
            required: true
        },
    }, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}
);


const bankDetailsModel = model("BankDetail", bankDetailsSchema);

export default bankDetailsModel;