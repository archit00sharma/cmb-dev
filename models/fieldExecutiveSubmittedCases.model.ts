
import mongoose, { model, Schema, Document } from "mongoose";
import { feSubmittedCases } from "../interfaces/feSubmittedCases.interface";

const submittedCaseSchema = new Schema({
  submittedDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        // Customize the date validation logic as per your requirements
        return !isNaN(value);
      },
      message: 'submittedDate must be a valid Date',
    },
  },
  assignedDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        // Customize the date validation logic as per your requirements
        return !isNaN(value);
      },
      message: 'assignedDate must be a valid Date',
    },
  },
  acceptedDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        // Customize the date validation logic as per your requirements
        return !isNaN(value);
      },
      message: 'acceptedDate must be a valid Date',
    },
  },
  fileNo: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Customize the fileNo validation logic as per your requirements
        return typeof value === 'string' && value.length > 0;
      },
      message: 'fileNo is required and must be a non-empty string',
    },
  },
  applicantName: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Customize the applicantName validation logic as per your requirements
        return typeof value === 'string' && value.length > 0;
      },
      message: 'applicantName is required and must be a non-empty string',
    },
  },
  addressType: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Customize the addressType validation logic as per your requirements
        return typeof value === 'string' && value.length > 0;
      },
      message: 'addressType is required and must be a non-empty string',
    },
  },
  address: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Customize the address validation logic as per your requirements
        return typeof value === 'string' && value.length > 0;
      },
      message: 'address is required and must be a non-empty string',
    },
  },
  bank: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Customize the bank validation logic as per your requirements
        return typeof value === 'string' && value.length > 0;
      },
      message: 'bank is required and must be a non-empty string',
    },
  },
  product: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Customize the product validation logic as per your requirements
        return typeof value === 'string' && value.length > 0;
      },
      message: 'product is required and must be a non-empty string',
    },
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    validate: {
      validator: function (value) {
        // Check if the value is a valid ObjectId
        return mongoose.Types.ObjectId.isValid(value);
      },
      message: 'caseid is required and must be a non-empty object id',
    },
  },
});

const feSubmittedCasesSchema = new Schema({
  fieldExecutiveId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    validate: {
      validator: function (value) {
        // Check if the value is a valid ObjectId
        return mongoose.Types.ObjectId.isValid(value);
      },
      message: 'fieldExecutiveId must be a valid ObjectId',
    },
  },
  submittedCases: {
    type: [submittedCaseSchema], // Assuming you've defined submittedCaseSchema elsewhere
    validate: {
      validator: function (value) {
        // Customize the array validation logic as per your requirements
        return Array.isArray(value) && value.length > 0;
      },
      message: 'submittedCases must be a non-empty array',
    },
  },
  date: {
    type: Date,
    required: true,
    index: true,
    validate: {
      validator: function (value) {
        // Customize the date validation logic as per your requirements
        return !isNaN(value);
      },
      message: 'date must be a valid Date',
    },
  },
});




const feSubmittedCasesModel = model<feSubmittedCases>("FeSubmittedCases", feSubmittedCasesSchema);

export default feSubmittedCasesModel;

