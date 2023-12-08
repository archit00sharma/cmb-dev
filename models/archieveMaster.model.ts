import { model, Schema, Document } from "mongoose";
import { archieveMaster } from "../interfaces/archieve_master.interface";


const archieveSchema: Schema = new Schema(
    {
        table_name: {
            type: String,
            trim: true,
            required: true,
        },
        last_archieve_status: {
            type: Object,
            status: {
                type: String,
                enum: ['success', 'failed'],
                required: true,
            },
            error: [{ errorMsg: { type: Object } }],
            total_documents_processed: {
                type: Object,
                required: true,
                readDocs: {
                    type: String
                },
                writeDocs: {
                    type: String
                },
                deletedDocs: {
                    type: String
                }
            }
        },
    }, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
}
);

archieveSchema.index({ createdAt: 1 })
const archieveMasterModel = model<archieveMaster>("ArchieveMaster", archieveSchema);

export default archieveMasterModel;