import mongoose from 'mongoose';

import invoiceFromModel from "../../models/Invoice/invoiceFrom.model";
import invoiceToModel from "../../models/Invoice/invoiceTo.model";
import bankDetailsModel from "@/models/Invoice/bank.model";
import invoiceModel from "@/models/Invoice/invoices.model";
import rateModel from "@/models/Invoice/rate.model";
import invoiceExcelDataStatusModel from "@/models/Invoice/invoiceExcelDataStatus.model";
import invoiceExcelDataModel from "@/models/Invoice/invoiceExcelData.model";
import invoiceDataExcelStatusModel from "@/models/Invoice/invoiceDataExcelStatus.model";

class invoiceService {
    public invoiceFrom = invoiceFromModel;

    // ********************************* INVOICE FROM CODE **************************

    public async getInvoiceFrom(id) {
        try {
            return await invoiceFromModel.findById(id)
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async addInvoiceFrom(data) {
        try {
            return await invoiceFromModel.create(data);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async updateInvoiceFrom(id, data) {
        try {
            return await invoiceFromModel.updateOne({ _id: id }, { $set: data });
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async deleteInvoiceFrom(id) {
        try {
            return await invoiceFromModel.findByIdAndDelete(id);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async getAllInvoiceFrom(req: any = {}, searchArray = []) {
        try {
            const pipeline = []
            const array1 = [];
            const array2 = [];
            const array3 = [];

            array3.push({
                $count: "sum",
            });

            if (searchArray.length > 0) {
                array1.push({
                    $match: {
                        $and: searchArray,
                    },
                });
                array2.push({
                    $match: {
                        $and: searchArray,
                    },
                });
            }

            array1.push({
                $count: "sum",
            });
            array2.push(
                {
                    $skip: parseInt(req.body.start),
                },
                {
                    $limit: parseInt(req.body.length),
                }
            );
            pipeline.push(
                {
                    $facet: {
                        sum1: array3,
                        sum2: array1,
                        data: array2,
                    },
                },
                {
                    $unwind: {
                        path: "$sum1",
                    },
                },
                {
                    $unwind: {
                        path: "$sum2",
                    },
                }
            );

            return await invoiceFromModel.aggregate(pipeline);

        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async allInvoiceFrom() {
        try {
            return await invoiceFromModel.find();
        } catch (error) {
            error.code = 401;
            return error
        }
    };


    // ******************* INVOICE TO CODE *********************************************

    public async getInvoiceTo(id) {
        try {
            return await invoiceToModel.findById(id)
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async addInvoiceTo(data) {
        try {
            return await invoiceToModel.create(data);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async updateInvoiceTo(id, data) {
        try {
            return await invoiceToModel.updateOne({ _id: id }, { $set: data });
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async deleteInvoiceTo(id) {
        try {
            return await invoiceToModel.findByIdAndDelete(id);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async getAllInvoiceTo(req: any = {}, searchArray = []) {
        try {
            const pipeline = []
            const array1 = [];
            const array2 = [];
            const array3 = [];

            array3.push({
                $count: "sum",
            });

            if (searchArray.length > 0) {
                array1.push({
                    $match: {
                        $and: searchArray,
                    },
                });
                array2.push({
                    $match: {
                        $and: searchArray,
                    },
                });
            }

            array1.push({
                $count: "sum",
            });
            array2.push(
                {
                    $skip: parseInt(req.body.start),
                },
                {
                    $limit: parseInt(req.body.length),
                }
            );
            pipeline.push(
                {
                    $facet: {
                        sum1: array3,
                        sum2: array1,
                        data: array2,
                    },
                },
                {
                    $unwind: {
                        path: "$sum1",
                    },
                },
                {
                    $unwind: {
                        path: "$sum2",
                    },
                }
            );

            return await invoiceToModel.aggregate(pipeline);

        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async allInvoiceTo() {
        try {
            return await invoiceToModel.find();
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    // ************************** BANK DETAILS CODE ********************************

    public async getBankDetails(id) {
        try {
            return await bankDetailsModel.findById(id)
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async addBankDetails(data) {
        try {
            return await bankDetailsModel.create(data);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async updateBankDetails(id, data) {
        try {
            return await bankDetailsModel.updateOne({ _id: id }, { $set: data });
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async deleteBankDetails(id) {
        try {
            return await bankDetailsModel.findByIdAndDelete(id);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async getAllBankDetails(req: any = {}, searchArray = []) {
        try {
            const pipeline = []
            const array1 = [];
            const array2 = [];
            const array3 = [];

            array3.push({
                $count: "sum",
            });

            if (searchArray.length > 0) {
                array1.push({
                    $match: {
                        $and: searchArray,
                    },
                });
                array2.push({
                    $match: {
                        $and: searchArray,
                    },
                });
            }

            array1.push({
                $count: "sum",
            });
            array2.push(
                {
                    $skip: parseInt(req.body.start),
                },
                {
                    $limit: parseInt(req.body.length),
                }
            );
            pipeline.push(
                {
                    $facet: {
                        sum1: array3,
                        sum2: array1,
                        data: array2,
                    },
                },
                {
                    $unwind: {
                        path: "$sum1",
                    },
                },
                {
                    $unwind: {
                        path: "$sum2",
                    },
                }
            );

            return await bankDetailsModel.aggregate(pipeline);

        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async allBankDetails() {
        try {
            return await bankDetailsModel.find();
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    // ********************** rate crud **********************************************
    public async getAllRates(req: any = {}, searchArray = []) {
        try {
            const pipeline = []
            const array1 = [];
            const array2 = [];
            const array3 = [];

            array3.push({
                $count: "sum",
            });

            if (searchArray.length > 0) {
                array1.push({
                    $match: {
                        $and: searchArray,
                    },
                });
                array2.push({
                    $match: {
                        $and: searchArray,
                    },
                });
            }

            array1.push({
                $count: "sum",
            });
            array2.push(
                {
                    $skip: parseInt(req.body.start),
                },
                {
                    $limit: parseInt(req.body.length),
                }
            );
            pipeline.push(
                {
                    $facet: {
                        sum1: array3,
                        sum2: array1,
                        data: array2,
                    },
                },
                {
                    $unwind: {
                        path: "$sum1",
                    },
                },
                {
                    $unwind: {
                        path: "$sum2",
                    },
                }
            );

            return await rateModel.aggregate(pipeline);

        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async getAllRate(cond) {
        try {
            return await rateModel.find(cond).lean();
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async getRate(cond = {}) {
        try {
            return await rateModel.findOne(cond);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async addRate(data) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            for (let i = 0; i < data.length; i++) {

                const rate = await rateModel.findOne({ product: data[i].product, area: data[i].area, bank: data[i].bank, point: data[i].point }, null,
                    { session }).sort({ from: -1 });

                if (rate) {
                    if (parseInt(data[i].from) !== (rate.to + 1)) {
                        throw new Error("no gap allowed in between ranges")
                    }

                } else {
                    if (data[i].from !== 0) {
                        throw new Error("from always starts from 0")
                    }
                }
            };

            const rateData = await rateModel.insertMany(data, { session })
            await session.commitTransaction();
            session.endSession();
            return rateData
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            error.code = 401;
            return error
        }
    };

    public async updateRate(id, data) {
        try {
            return await rateModel.findByIdAndUpdate(id, { $set: data });
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async deleteRate(id) {
        try {
            return await rateModel.findByIdAndDelete(id);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    // *************************** Invoice Crud Code *********************************

    // ************ invoice table **************************

    public async getAllInvoiceList(req: any = {}, searchArray = []) {
        try {
            const pipeline = []
            const array1 = [];
            const array2 = [];
            const array3 = [];

            array3.push({
                $count: "sum",
            });

            if (searchArray.length > 0) {
                array1.push({
                    $match: {
                        $and: searchArray,
                    },
                });
                array2.push({
                    $match: {
                        $and: searchArray,
                    },
                });
            }

            array1.push({
                $count: "sum",
            });
            array2.push(
                {
                    $skip: parseInt(req.body.start),
                },
                {
                    $limit: parseInt(req.body.length),
                }
            );
            pipeline.push(
                {
                    $facet: {
                        sum1: array3,
                        sum2: array1,
                        data: array2,
                    },
                },
                {
                    $unwind: {
                        path: "$sum1",
                    },
                },
                {
                    $unwind: {
                        path: "$sum2",
                    },
                }
            );

            return await invoiceModel.aggregate(pipeline);

        } catch (error) {
            error.code = 401;
            return error
        }
    };


    // ********************* invoice excel data status *******************

    public async getAllInvoiceExcelDataStatusList(req: any = {}, searchArray = []) {
        try {
            const pipeline = []
            const array1 = [];
            const array2 = [];
            const array3 = [];

            array3.push({
                $count: "sum",
            });

            if (searchArray.length > 0) {
                array1.push({
                    $match: {
                        $and: searchArray,
                    },
                });
                array2.push({
                    $match: {
                        $and: searchArray,
                    },
                });
            }

            array1.push({
                $count: "sum",
            });
            array2.push(
                {
                    $skip: parseInt(req.body.start),
                },
                {
                    $limit: parseInt(req.body.length),
                }
            );
            pipeline.push(
                {
                    $facet: {
                        sum1: array3,
                        sum2: array1,
                        data: array2,
                    },
                },
                {
                    $unwind: {
                        path: "$sum1",
                    },
                },
                {
                    $unwind: {
                        path: "$sum2",
                    },
                }
            );

            return await invoiceExcelDataStatusModel.aggregate(pipeline);

        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async createInvoiceExcelDataStatus(data) {
        try {
            return await invoiceExcelDataStatusModel.create(data);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async updateInvoiceExcelDataStatus(id, data) {
        try {
            return await invoiceExcelDataStatusModel.findOneAndUpdate(id, data);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async deleteInvoiceExcelDataStatus(id, uniqueId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await invoiceExcelDataModel.deleteMany({ uniqueId }, { session })
            const deletedExcelStatus = await invoiceExcelDataStatusModel.findByIdAndDelete(id, { session });
            await session.commitTransaction();
            session.endSession();
            return deletedExcelStatus
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            error.code = 401;
            return error
        }
    };

    // ******************** invoice excel data table *******************

    public async getAllInvoiceExcelData(req: any = {}, searchArray = []) {
        try {
            const pipeline = [];
            const array1 = [];
            const array2 = [];
            const array3 = [];

            array3.push({
                $match: {
                    uniqueId: req.body.id
                },
            }, {
                $count: "sum",
            });

            array1.push({
                $match: {
                    uniqueId: req.body.id
                },
            },);
            array2.push(
                {
                    $match: {
                        uniqueId: req.body.id
                    },
                },
            );

            if (searchArray.length > 0) {
                array1.push({
                    $match: {
                        $and: searchArray,
                    },
                });
                array2.push({
                    $match: {
                        $and: searchArray,
                    },
                });
            }

            array1.push({
                $count: "sum",
            });
            array2.push(
                {
                    $skip: parseInt(req.body.start),
                },
                {
                    $limit: parseInt(req.body.length),
                }
            );
            pipeline.push(
                {
                    $facet: {
                        sum1: array3,
                        sum2: array1,
                        data: array2,
                    },
                },
                {
                    $unwind: {
                        path: "$sum1",
                    },
                },
                {
                    $unwind: {
                        path: "$sum2",
                    },
                }
            );

            return await invoiceExcelDataModel.aggregate(pipeline);

        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async allInvoiceExcelData(cond = {}, select = {}) {
        try {
            return await invoiceExcelDataModel.find(cond).select(select);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async createInvoiceExcelData(data) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const invoiceExcelData = await invoiceExcelDataModel.insertMany(data, { session });
            await session.commitTransaction();
            session.endSession();
            return invoiceExcelData;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            error.code = 401;
            return error
        }
    };

    public async updateInvoiceExcelData(id, data) {
        try {
            return await invoiceExcelDataModel.findByIdAndUpdate(id, data);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async deleteInvoiceExcelData(id) {
        try {
            return await invoiceExcelDataModel.findByIdAndDelete(id);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    // ************************************ invoice data excel status ********************************

    public async getAllInvoiceDataExcelStatusList(req: any = {}, searchArray = []) {
        try {
            const pipeline = []
            const array1 = [];
            const array2 = [];
            const array3 = [];

            array3.push({
                $count: "sum",
            });

            if (searchArray.length > 0) {
                array1.push({
                    $match: {
                        $and: searchArray,
                    },
                });
                array2.push({
                    $match: {
                        $and: searchArray,
                    },
                });
            }

            array1.push({
                $count: "sum",
            });
            array2.push(
                {
                    $skip: parseInt(req.body.start),
                },
                {
                    $limit: parseInt(req.body.length),
                }
            );
            pipeline.push(
                {
                    $facet: {
                        sum1: array3,
                        sum2: array1,
                        data: array2,
                    },
                },
                {
                    $unwind: {
                        path: "$sum1",
                    },
                },
                {
                    $unwind: {
                        path: "$sum2",
                    },
                }
            );

            return await invoiceDataExcelStatusModel.aggregate(pipeline);

        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async getInvoiceDataExcel(cond) {
        try {
            return await invoiceDataExcelStatusModel.findOne(cond);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async getInvoiceDataExcelAggregate(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: "invoicetos",
                        localField: "data.invoiceTo",
                        foreignField: "_id",
                        as: "data.invoiceTo"
                    }
                },
                {
                    $lookup: {
                        from: "invoicefroms",
                        localField: "data.invoiceFrom",
                        foreignField: "_id",
                        as: "data.invoiceFrom"
                    }
                },
                {
                    $lookup: {
                        from: "bankdetails",
                        localField: "data.bankDetails",
                        foreignField: "_id",
                        as: "data.bankDetails"
                    }
                },
            ]
            return await invoiceExcelDataStatusModel.aggregate(pipeline);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async createInvoiceDataExcelStatus(data) {
        try {
            return await invoiceDataExcelStatusModel.create(data);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async updateInvoiceDataExcelStatus(id, data) {
        try {
            return await invoiceDataExcelStatusModel.findOneAndUpdate(id, data);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async deleteExcelFile(id) {
        try {
            return await invoiceDataExcelStatusModel.findByIdAndDelete(id);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    // ************************************* invoice ********************************************************
    public async createInvoice(data) {
        try {
            return await invoiceModel.create(data);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async updateInvoiceStatus(id, data) {
        try {
            return await invoiceModel.findOneAndUpdate(id, data);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async getInvoice(cond) {
        try {
            return await invoiceModel.findOne(cond);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

    public async deleteInvoice(id) {
        try {
            return await invoiceModel.findByIdAndDelete(id);
        } catch (error) {
            error.code = 401;
            return error
        }
    };

}
export default invoiceService;
