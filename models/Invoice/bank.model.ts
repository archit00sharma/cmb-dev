import { model, Schema } from "mongoose";



const bankDetailsSchema: Schema = new Schema(
    {

        templateName: {
            type: String,
            require: true
        },
        bankName: {
            type: String,
            require: true
        },
        branch: {
            type: String,
            require: true
        },
        accountNo: {
            type: String,
            require: true
        },
        rtgsCode: {
            type: String,
            require: true
        },
        ifscCode: {
            type: String,
            require: true
        },
        accountHolderName: {
            type: String,
            require: true
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