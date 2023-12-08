
import archieveMasterModel from "../../models/archieveMaster.model";

// ************** case ****************************************
import caseModel from "@/models/case.model";
import archieveCaseModel from "@/models/archieveModels/case.model";

// ************************** Fe ******************************
import fieldExecutiveModel from "@/models/fieldExecutive.model";
import archieveFieldExecutiveModel from "@/models/archieveModels/fe.model";


import getDateTime from "../getCurrentDateTime";

export async function archiveOldData() {
    try {
        const twoMonthsAgo = getDateTime();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        twoMonthsAgo.setHours(0, 0, 0, 0);

        const documentsToArchiveStream = archieveMasterModel.find().cursor();

        for await (const document of documentsToArchiveStream) {
            const { table_name } = document;
            let last_archieve_status = {
                status: 'failed',
                error: [],
                total_documents_processed: {
                    readDocs: 0,
                    writeDocs: 0,
                    deletedDocs: 0,
                },
            };

            try {
                switch (table_name) {
                    case 'caseModel':
                        const caseData = await caseModel.find({ caseUploaded: { $lt: twoMonthsAgo } }).lean();
                        last_archieve_status.total_documents_processed.readDocs = caseData.length;

                        try {
                            const storedData = await archieveCaseModel.insertMany(caseData);
                            last_archieve_status.total_documents_processed.writeDocs = storedData.length;
                        } catch (error) {
                            const errorMsg = error.message;
                            last_archieve_status.error.push(`Error while storing data: ${errorMsg}`);
                            throw error; // Rethrow the error to terminate further processing
                        }

                        try {
                            const deleteResult = await caseModel.deleteMany({ caseUploaded: { $lt: twoMonthsAgo } });
                            last_archieve_status.total_documents_processed.deletedDocs = deleteResult.deletedCount;
                        } catch (error) {
                            const errorMsg = error.message;
                            last_archieve_status.error.push(`Error while deleting data: ${errorMsg}`);
                            throw error; // Rethrow the error to terminate further processing
                        }

                        last_archieve_status.status = 'success';
                        last_archieve_status.error = [];
                        break;

                    case 'fieldExecutiveModel':
                        const feData: any = await fieldExecutiveModel.find().lean();
                        last_archieve_status.total_documents_processed.readDocs = feData.length;
                        let finalIdex = null
                        for (let i = 0; i < 2; i++) {
                            const filteredCordinateData = [];
                            const nonFilteredCordinateData = [];

                            feData[i].cordinates && feData[i].cordinates.length > 0 && feData[i].cordinates.forEach((data, index) => {
                                const date = data[0].date || data[0].datetime;
                                const dataDate: any = new Date(date);

                                if (!isNaN(dataDate)) {
                                    if (dataDate < twoMonthsAgo) {
                                        filteredCordinateData.push(data);
                                    } else {
                                        nonFilteredCordinateData.push(data);
                                    }
                                }
                            });

                            const filteredSubmittedData = [];
                            const nonFilteredSubmittedData = [];

                            feData[i].submittedCases && feData[i].submittedCases.length > 0 && feData[i].submittedCases.forEach((data) => {
                                const date = data.submittedDate;
                                const dataDate: any = new Date(date);

                                if (!isNaN(dataDate)) {
                                    if (dataDate < twoMonthsAgo) {
                                        filteredSubmittedData.push(data);
                                    } else {
                                        nonFilteredSubmittedData.push(data);
                                    }
                                }
                            });

                            const updateFeData: any = {
                                fullName: feData[i].fullName,
                                email: feData[i].email,
                                profilePic: feData[i].profilePic,
                                mobile: feData[i].mobile,
                                password: feData[i].password,
                                panCard: feData[i].panCard,
                                aadhaarCard: feData[i].aadhaarCard,
                                isDeleted: feData[i].isDeleted
                            };

                            const startRange = 0; // Start index of the range to delete
                            const endRange = finalIdex; // End index of the range to delete

                            const deleteRange = [];
                            for (let i = startRange; i <= endRange; i++) {
                                deleteRange.push(i);
                            }

                            const checkFeExist = await archieveFieldExecutiveModel.findOne({ email: feData[i].email })
                            if (checkFeExist) {
                                const updateFe = await archieveFieldExecutiveModel.updateOne({ email: feData[i].email }, { $push: { cordinates: filteredCordinateData, submittedCases: filteredSubmittedData }, $set: { updateFeData } })
                                if (updateFe.modifiedCount > 0) {
                                    last_archieve_status.total_documents_processed.writeDocs++
                                    const deleteOldFe = await fieldExecutiveModel.updateOne({ email: feData[i].email }, { $set: { cordinates: nonFilteredCordinateData, submittedCases: nonFilteredSubmittedData } })
                                }

                            } else {

                                updateFeData.cordinates = filteredCordinateData;
                                updateFeData.submittedCases = filteredSubmittedData;

                                const insertFe = await archieveFieldExecutiveModel.create(updateFeData)
                                if (insertFe) {
                                    last_archieve_status.total_documents_processed.writeDocs++
                                    const deleteOldFe = await fieldExecutiveModel.updateOne({ email: feData[i].email }, { $set: { cordinates: nonFilteredCordinateData, submittedCases: nonFilteredSubmittedData } })
                                    if (deleteOldFe.modifiedCount > 0) {
                                        last_archieve_status.total_documents_processed.deletedDocs++
                                    }
                                }
                            }


                        }



                        // try {
                        //     const storedData = await archieveCaseModel.insertMany(caseData);
                        //     last_archieve_status.total_documents_processed.writeDocs = storedData.length;
                        // } catch (error) {
                        //     const errorMsg = error.message;
                        //     last_archieve_status.error.push(`Error while storing data: ${errorMsg}`);
                        //     throw error; // Rethrow the error to terminate further processing
                        // }

                        // try {
                        //     const deleteResult = await caseModel.deleteMany({ caseUploaded: { $lt: twoMonthsAgo } });
                        //     last_archieve_status.total_documents_processed.deletedDocs = deleteResult.deletedCount;
                        // } catch (error) {
                        //     const errorMsg = error.message;
                        //     last_archieve_status.error.push(`Error while deleting data: ${errorMsg}`);
                        //     throw error; // Rethrow the error to terminate further processing
                        // }

                        last_archieve_status.status = 'success';
                        last_archieve_status.error = [];
                        break;

                    default:
                        // Handle default case here
                        break;
                }
            } catch (error) {
                const errorMsg = error.message;
                console.error(`Error occurred for document ID ${document._id}: ${errorMsg}`);
            }

            await archieveMasterModel.updateOne({ _id: document._id }, { $set: { last_archieve_status } });
        }

        console.log("Data archiving completed successfully!");
    } catch (error) {
        console.error("Error occurred during data archiving:", error);
    }
}






// const cron = require("node-cron");
// cron.schedule("0 3 * * *", archiveOldData);
