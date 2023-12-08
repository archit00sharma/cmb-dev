
import Messages from "messages"
import path from "path";
import Excel from "exceljs"
import fs from 'fs'
import url from "url"
import moment from "moment"

let createPendingCaseExcel = async (caseData: any, role: any) => {
    try {

        const fileUrl = path.join(__dirname, "../../public/pendingEx/")
        var workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(`${fileUrl}myFile.xlsx`)
            .then(async function () {
                var worksheet = workbook.getWorksheet(1)
                if (role == "manager") {
                    worksheet.spliceColumns(5, 3)
                }
                if (role == "senior-supervisor") {
                    worksheet.spliceColumns(5, 6)
                }
                if (role == "supervisor") {
                    worksheet.spliceColumns(5, 9)
                }
                for (let i = 0; i < caseData.length; i++) {
                    var row = worksheet.getRow(i + 3);
                    row.getCell(1).value = `${i + 1}`;
                    row.getCell(2).value = caseData[i].fileNo;
                    row.getCell(3).value = caseData[i].caseUploaded ? moment(caseData[i].caseUploaded).utc().format('YYYY-MM-DD') : "";
                    row.getCell(4).value = caseData[i].caseUploaded ? moment(caseData[i].caseUploaded).utc().format("HH:mm:ss") : "";

                    if (role == "admin") {
                        row.getCell(5).value = caseData[i].manager ? caseData[i].manager.name ? caseData[i].manager.name : "" : ""
                        row.getCell(6).value = caseData[i].manager ? caseData[i].manager.assignedDate ? moment(caseData[i].manager.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(7).value = caseData[i].manager ? caseData[i].manager.assignedDate ? moment(caseData[i].manager.assignedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(8).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.name ? caseData[i].seniorSupervisor.name : "" : ""
                        row.getCell(9).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.assignedDate ? moment(caseData[i].seniorSupervisor.assignedDate).utc().format("YYYY-MM-DD") : "" : "";
                        row.getCell(10).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.assignedDate ? moment(caseData[i].seniorSupervisor.assignedDate).utc().format("HH:mm:ss") : "" : "";
                        row.getCell(11).value = caseData[i].supervisor ? caseData[i].supervisor.name ? caseData[i].supervisor.name : "" : ""
                        row.getCell(12).value = caseData[i].supervisor ? caseData[i].supervisor.assignedDate ? moment(caseData[i].supervisor.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(13).value = caseData[i].supervisor ? caseData[i].supervisor.assignedDate ? moment(caseData[i].supervisor.assignedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(14).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.name ? caseData[i].fieldExecutive.name : "" : ""
                        row.getCell(15).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(16).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(17).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(18).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(19).value = caseData[i].applicantName;
                        row.getCell(20).value = caseData[i].addressType;
                        row.getCell(21).value = caseData[i].address;
                        row.getCell(22).value = caseData[i].product;
                        row.getCell(23).value = caseData[i].area;
                        row.getCell(24).value = caseData[i].bank;
                        row.getCell(25).value = caseData[i].mobileNo;
                    }
                    if (role == "manager") {
                        row.getCell(5).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.name ? caseData[i].seniorSupervisor.name : "" : ""
                        row.getCell(6).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.assignedDate ? moment(caseData[i].seniorSupervisor.assignedDate).utc().format("YYYY-MM-DD") : "" : "";
                        row.getCell(7).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.assignedDate ? moment(caseData[i].seniorSupervisor.assignedDate).utc().format("HH:mm:ss") : "" : "";
                        row.getCell(8).value = caseData[i].supervisor ? caseData[i].supervisor.name ? caseData[i].supervisor.name : "" : ""
                        row.getCell(9).value = caseData[i].supervisor ? caseData[i].supervisor.assignedDate ? moment(caseData[i].supervisor.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(10).value = caseData[i].supervisor ? caseData[i].supervisor.assignedDate ? moment(caseData[i].supervisor.assignedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(11).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.name ? caseData[i].fieldExecutive.name : "" : ""
                        row.getCell(12).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(13).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(14).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(15).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(16).value = caseData[i].applicantName;
                        row.getCell(17).value = caseData[i].addressType;
                        row.getCell(18).value = caseData[i].address;
                        row.getCell(19).value = caseData[i].product;
                        row.getCell(20).value = caseData[i].area;
                        row.getCell(21).value = caseData[i].bank;
                        row.getCell(22).value = caseData[i].mobileNo;
                    }
                    if (role == "senior-supervisor") {
                        row.getCell(5).value = caseData[i].supervisor ? caseData[i].supervisor.name ? caseData[i].supervisor.name : "" : ""
                        row.getCell(6).value = caseData[i].supervisor ? caseData[i].supervisor.assignedDate ? moment(caseData[i].supervisor.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(7).value = caseData[i].supervisor ? caseData[i].supervisor.assignedDate ? moment(caseData[i].supervisor.assignedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(8).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.name ? caseData[i].fieldExecutive.name : "" : ""
                        row.getCell(9).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(10).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(11).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(12).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(13).value = caseData[i].applicantName;
                        row.getCell(14).value = caseData[i].addressType;
                        row.getCell(15).value = caseData[i].address;
                        row.getCell(16).value = caseData[i].product;
                        row.getCell(17).value = caseData[i].area;
                        row.getCell(18).value = caseData[i].bank;
                        row.getCell(19).value = caseData[i].mobileNo;
                    }
                    if (role == "supervisor") {
                        row.getCell(5).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.name ? caseData[i].fieldExecutive.name : "" : ""
                        row.getCell(6).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(7).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(8).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(9).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(10).value = caseData[i].applicantName;
                        row.getCell(11).value = caseData[i].addressType;
                        row.getCell(12).value = caseData[i].address;
                        row.getCell(13).value = caseData[i].product;
                        row.getCell(14).value = caseData[i].area;
                        row.getCell(15).value = caseData[i].bank;
                        row.getCell(16).value = caseData[i].mobileNo;
                    }

                }
                row.commit();
                await workbook.xlsx.writeFile(`${fileUrl}newFile.xlsx`);
            })
        async function checkFile() {
            let g = url.pathToFileURL(`${fileUrl}newFile.xlsx`)
            if (fs.existsSync(`${fileUrl}newFile.xlsx`)) {
                return Messages.SUCCESS.UPDATED_SUCCESSFULLY
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG
            }
        }
        return await checkFile()
    } catch (error) {
    
        return Messages.Failed.SOMETHING_WENT_WRONG
    }
}
export default createPendingCaseExcel