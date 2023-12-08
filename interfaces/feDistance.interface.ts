import mongoose from "mongoose";

export interface feDistance {
    _id: String;
    fieldExecutiveId: mongoose.Schema.Types.ObjectId;
    distance: string;
    date: Date;
}