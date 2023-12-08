
import mongoose, { model, Schema, Document } from "mongoose";
import { feCoordinates } from "../interfaces/feCoordinates.interface";

const coordinateSchema = new Schema({
    status: {
        type: String,
        enum: ['case', 'on', 'off'],
        required: true,
        validate: {
            validator: function (value) {
                return ['case', 'on', 'off'].includes(value);
            },
            message: 'status must be one of: case, on, off'
        },
    },
    lat_long: {
        type: Array,
        validate: {
            validator: function (value) {
                return value && value.length === 2;
            },
            message: 'lat_long is required and must be an array with 2 elements'
        },
        required: true
    },
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        validate: {
            validator: function (value) {
                // Check if the value is a valid ObjectId
                return mongoose.Types.ObjectId.isValid(value);
            },
            message: 'caseId must be a valid ObjectId'
        },
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return !isNaN(value);
            },
            message: 'date must be a valid Date'
        },
    },
});


const feCoordinatesSchema: Schema = new Schema({
    fieldExecutiveId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    coordinates: {
        type: [coordinateSchema], // Assuming you've defined submittedCaseSchema elsewhere
        validate: {
            validator: function (value) {
                // Customize the array validation logic as per your requirements
                return Array.isArray(value) && value.length > 0;
            },
            message: 'coordinates must be a non-empty array',
        },
    },
    date: {
        type: Date,
        required: true,
        index: true,
        validate: {
            validator: function (value) {
                return !isNaN(value);
            },
            message: 'date must be a valid Date'
        },
    },
});

feCoordinatesSchema.index({ 'coordinates.lat_long': '2d' });

const feCoordinatesModel = model<feCoordinates>("FeCoordinates", feCoordinatesSchema);

export default feCoordinatesModel;

