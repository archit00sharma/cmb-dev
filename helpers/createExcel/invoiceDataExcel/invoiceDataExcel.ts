
import Messages from "messages";
import path from "path";
import Excel from "exceljs";
import fs from 'fs';
import moment from "moment";
import invoiceService from "@/services/invoiceServices/invoice.service";

let createInvoiceDataExcel = async (invoiceExcelFormat, uniqueId) => {
    const invoiceServices = new invoiceService();
    let addFile
    try {
        let fileUrl = path.join(__dirname, "../../../public/invoices/");
        const fileName = `${invoiceExcelFormat}_${Date.now()}.xlsx`;
        const newFileUrl = `${fileUrl}invoiceExcelFiles/${fileName}`;
        const databaseFileUrl = `/invoices/invoiceExcelFiles/${fileName}`;
        addFile = await invoiceServices.createInvoiceDataExcelStatus({ fileUrl: databaseFileUrl, uniqueId, invoiceExcelFormat, status: 'processing', name: fileName });
        const cond = { uniqueId }
        const data = await invoiceServices.allInvoiceExcelData(cond);

        switch (invoiceExcelFormat) {
            case 'common_format':

                var workbook = new Excel.Workbook();
                await workbook.xlsx.readFile(`${fileUrl}invoiceDataExcel/common_format.xlsx`).then(async function () {
                    var worksheet = workbook.getWorksheet(1)

                    for (let i = 0; i < data.length; i++) {
                        var row = worksheet.getRow(i + 2);
                        row.getCell(1).value = `${i + 1}`;
                        row.getCell(2).value = data[i]?.date || "";
                        row.getCell(3).value = data[i]?.fileNo || "";
                        row.getCell(4).value = data[i]?.barCode || "";
                        row.getCell(5).value = data[i]?.applicantName || "";
                        row.getCell(6).value = data[i]?.addressType || "";
                        row.getCell(7).value = data[i]?.product || "";
                        row.getCell(8).value = data[i]?.address || "";
                        row.getCell(9).value = data[i]?.branch || "";
                        row.getCell(10).value = data[i]?.area || "";
                        row.getCell(11).value = data[i]?.mobileNo || "";
                        row.getCell(12).value = data[i]?.caseStatus || "";
                        row.getCell(13).value = data[i]?.point || "";
                        row.getCell(14).value = data[i]?.distance || "";
                        row.getCell(15).value = data[i]?.rate || "";
                    }
                    row.commit();
                    await workbook.xlsx.writeFile(newFileUrl);
                });
                fs.access(newFileUrl, fs.constants.F_OK, async (err) => {
                    if (err) {
                        await invoiceServices.updateInvoiceDataExcelStatus({ _id: addFile._id }, { $set: { error: err.message, status: "failed" } })
                    } else {
                        await invoiceServices.updateInvoiceDataExcelStatus({ _id: addFile._id }, { $set: { status: "success" } })
                    }
                });
                break;
            case "csl_format":
                var workbook = new Excel.Workbook();
                await workbook.xlsx.readFile(`${fileUrl}invoiceDataExcel/csl_format.xlsx`).then(async function () {
                    var worksheet = workbook.getWorksheet(1)

                    for (let i = 0; i < data.length; i++) {
                        var row = worksheet.getRow(i + 2);
                        row.getCell(1).value = `${i + 1}`;
                        row.getCell(2).value = data[i]?.date || "";
                        row.getCell(3).value = data[i]?.fileNo || "";
                        row.getCell(4).value = data[i]?.applicantName || "";
                        row.getCell(5).value = data[i]?.addressType || "";
                        row.getCell(6).value = data[i]?.address || "";
                        row.getCell(7).value = data[i]?.area || "";
                        row.getCell(8).value = data[i]?.mobileNo || "";
                        row.getCell(9).value = data[i]?.caseStatus || "";
                        row.getCell(10).value = data[i]?.point || "";
                        row.getCell(11).value = data[i]?.distance || "";
                        row.getCell(12).value = data[i]?.conveyance?.distance || "";
                        row.getCell(13).value = data[i]?.rate || "";
                    }
                    row.commit();
                    await workbook.xlsx.writeFile(newFileUrl);
                })
                fs.access(newFileUrl, fs.constants.F_OK, async (err) => {
                    if (err) {
                        await invoiceServices.updateInvoiceDataExcelStatus({ _id: addFile._id }, { $set: { error: err.message, status: "failed" } })
                    } else {
                        await invoiceServices.updateInvoiceDataExcelStatus({ _id: addFile._id }, { $set: { status: "success" } })
                    }
                });
                break;
            case "bandhan_format":

                var workbook = new Excel.Workbook();
                await workbook.xlsx.readFile(`${fileUrl}invoiceDataExcel/bandhan_format`).then(async function () {
                    var worksheet = workbook.getWorksheet(1)

                    for (let i = 0; i < data.length; i++) {
                        var row = worksheet.getRow(i + 2);
                        row.getCell(1).value = `${i + 1}`;
                        row.getCell(2).value = data[i]?.fileNo || "";
                        row.getCell(3).value = data[i]?.applicantName || "";
                        row.getCell(4).value = data[i]?.address || "";
                        row.getCell(5).value = data[i]?.addressType || "";
                        row.getCell(6).value = data[i]?.caseStatus || "";
                        row.getCell(7).value = moment(data[i]?.caseUploaded).utc().format("YYYY-MM-DD HH:mm:ss") || 'Na';
                        row.getCell(8).value = moment(data[i].seniorSupervisor?.submittedDate || data[i].manager?.submittedDate || data[i].admin?.submittedDate).utc().format("YYYY-MM-DD HH:mm:ss") || 'Na';
                        row.getCell(9).value = data[i]?.agencyName || "";
                        row.getCell(10).value = data[i]?.product || "";
                        row.getCell(11).value = data[i]?.state || "";
                        row.getCell(12).value = data[i]?.branchId || "";
                        row.getCell(13).value = data[i]?.businessBranch || "";
                        row.getCell(14).value = data[i]?.rate || "";
                        row.getCell(15).value = data[i].businessHrs ? data[i].businessHrs : (function () {
                            const caseUploaded = moment(data[i].caseUploaded).utc();
                            const caseSubmitted = moment(data[i].seniorSupervisor?.submittedDate || data[i].manager?.submittedDate || data[i].admin?.submittedDate).utc();

                            if (caseUploaded.isValid() && caseSubmitted.isValid()) {
                                const duration = moment.duration(caseSubmitted.diff(caseUploaded));
                                const hours = duration.asHours();
                                return hours.toFixed(2)
                            } else {
                                return 'Na';
                            }
                        })();
                        row.getCell(16).value = data[i].businessHrs ? (function () {
                            if (data[i].distance >= 0 && data[i].distance <= 25 && data[i].businessHrs <= 4) {
                                return 'within';
                            } else if (data[i].distance >= 26 && data[i].businessHrs <= 8) {
                                return 'within';
                            } else {
                                return 'out of Tat';
                            }
                        })() : (function () {
                            const caseUploaded = moment(data[i].caseUploaded).utc();
                            const caseSubmitted = moment(data[i].seniorSupervisor?.submittedDate || data[i].manager?.submittedDate || data[i].admin?.submittedDate).utc();

                            if (caseUploaded.isValid() && caseSubmitted.isValid()) {
                                const duration = moment.duration(caseSubmitted.diff(caseUploaded));
                                const hours = duration.asHours();

                                if (data[i].distance >= 0 && data[i].distance <= 25 && hours <= 4) {
                                    return 'within';
                                } else if (data[i].distance >= 26 && hours <= 8) {
                                    return 'within';
                                } else {
                                    return 'out of Tat';
                                }
                            } else {
                                return "Na";
                            }
                        })();
                        row.getCell(17).value = data[i]?.oglOrWithin || "";
                    }
                    row.commit();
                    await workbook.xlsx.writeFile(newFileUrl);
                })
                fs.access(newFileUrl, fs.constants.F_OK, async (err) => {
                    if (err) {
                        await invoiceServices.updateInvoiceDataExcelStatus({ _id: addFile._id }, { $set: { error: err.message, status: "failed" } })
                    } else {
                        await invoiceServices.updateInvoiceDataExcelStatus({ _id: addFile._id }, { $set: { status: "success" } })
                    }
                });
                break;
            case "hdfc_format":

                var workbook = new Excel.Workbook();
                await workbook.xlsx.readFile(`${fileUrl}invoiceDataExcel/hdfc_format.xlsx`).then(async function () {
                    var worksheet = workbook.getWorksheet(1)

                    for (let i = 0; i < data.length; i++) {
                        let fiToBeConducted = '';

                        if (data[i].rv?.address) fiToBeConducted += 'rv,';
                        if (data[i].pv?.address) fiToBeConducted += 'pv,';
                        if (data[i].bv?.address) fiToBeConducted += 'bv';

                        var row = worksheet.getRow(i + 3);
                        row.getCell(1).value = `${i + 1}`;
                        row.getCell(2).value = data[i]?.fileNo || "";
                        row.getCell(3).value = data[i]?.applicantName || "";
                        row.getCell(4).value = fiToBeConducted
                        row.getCell(5).value = data[i]?.product || "";
                        row.getCell(6).value = data[i]?.rv?.address || "";
                        row.getCell(7).value = data[i]?.bv?.address || "";
                        row.getCell(8).value = data[i]?.pv?.address || "";
                        row.getCell(9).value = data[i]?.date || "";
                        row.getCell(10).value = data[i]?.area || "";
                        row.getCell(11).value = data[i].addresstype === 'PV' ? data[i]?.pv?.distance : data[i]?.rv?.distance || 0;
                        row.getCell(12).value = data[i]?.branch || "";
                        row.getCell(13).value = data[i]?.caseStatus || "";
                        row.getCell(14).value = data[i]?.point || "";
                        row.getCell(15).value = data[i]?.bv?.distance || 0;
                        row.getCell(16).value = data[i]?.rate || "";
                        row.getCell(17).value = data[i]?.rv?.remark || "";
                        row.getCell(18).value = data[i]?.bv?.remark || "";
                        row.getCell(19).value = data[i]?.remarks || "NA";
                        row.getCell(20).value = data[i]?.cpvBy || "NA";
                    }
                    row.commit();
                    await workbook.xlsx.writeFile(newFileUrl);
                })
                fs.access(newFileUrl, fs.constants.F_OK, async (err) => {
                    if (err) {
                        await invoiceServices.updateInvoiceDataExcelStatus({ _id: addFile._id }, { $set: { error: err.message, status: "failed" } })
                    } else {
                        await invoiceServices.updateInvoiceDataExcelStatus({ _id: addFile._id }, { $set: { status: "success" } })
                    }
                });
                break;
            default:
                break;
        }
    } catch (err) {
        await invoiceServices.updateInvoiceDataExcelStatus({ _id: addFile._id }, { $set: { error: err.message, status: "failed" } })
        return Messages.Failed.SOMETHING_WENT_WRONG
    }
}
export default createInvoiceDataExcel