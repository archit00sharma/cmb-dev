import mongoose from "mongoose";

export interface feCoordinates {
    _id: String;
    fieldExecutiveId: mongoose.Schema.Types.ObjectId;
    coordinates: Array<any>;
    date: Date;
}