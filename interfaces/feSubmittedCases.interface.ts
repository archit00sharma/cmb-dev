import mongoose from "mongoose";

export interface feSubmittedCases extends mongoose.Document {
    fieldExecutiveId: mongoose.Types.ObjectId;
    submittedCases: Array<{
      submittedDate: Date;
      assignedDate: Date;
      acceptedDate: Date;
      fileNo: string;
      applicantName: string;
      addressType: string;
      address: string;
      bank: string;
      product: string;
    }>;
    date: Date;
  }