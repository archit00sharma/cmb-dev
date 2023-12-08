import { Response, Router } from "express";
import Messages from "messages"
import path from "path";
import Excel from "exceljs"
import fs from 'fs'
import { readFile } from 'fs'
import url from "url"
import moment from "moment"

let teamEfficiencyExcel = async (caseData: any) => {
    try {
        let start = Date.now();
      
        const fileUrl = path.join(__dirname, "../../public/succEx/")
        var workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(`${fileUrl}myFile.xlsx`)
            .then(async function () {
                var worksheet = workbook.getWorksheet(1)
                worksheet.spliceColumns(47, 48)
                for (let i = 0; i < caseData.length; i++) {
                   
                    var row = worksheet.getRow(i + 3);
                    row.getCell(1).value = `${i + 1}`;
                    row.getCell(2).value = caseData[i].date;
                    row.getCell(3).value = caseData[i].time;
                    row.getCell(4).value = caseData[i].fileNo;
                    row.getCell(5).value = caseData[i].barCode;
                    row.getCell(6).value = caseData[i].applicantName;
                    row.getCell(7).value = caseData[i].applicantType;
                    row.getCell(8).value = caseData[i].addressType;
                    row.getCell(9).value = caseData[i].officeName;
                    row.getCell(10).value = caseData[i].address;
                    row.getCell(11).value = caseData[i].pinCode;
                    row.getCell(12).value = caseData[i].branch;
                    row.getCell(13).value = caseData[i].area;
                    row.getCell(14).value = caseData[i].mobileNo;
                    row.getCell(15).value = caseData[i].bank;
                    row.getCell(16).value = caseData[i].product;
                    row.getCell(17).value = caseData[i].caseUploaded ? moment(caseData[i].caseUploaded).utc().format('YYYY-MM-DD') : "";
                    row.getCell(18).value = caseData[i].caseUploaded ? moment(caseData[i].caseUploaded).utc().format("HH:mm:ss") : "";
                    row.getCell(19).value = caseData[i].manager ? caseData[i].manager.name ? caseData[i].manager.name : "" : ""
                    row.getCell(20).value = caseData[i].manager ? caseData[i].manager.assignedDate ? moment(caseData[i].manager.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                    row.getCell(21).value = caseData[i].manager ? caseData[i].manager.assignedDate ? moment(caseData[i].manager.assignedDate).utc().format("HH:mm:ss") : "" : ""
                    row.getCell(22).value = caseData[i].manager ? caseData[i].manager.submittedDate ? moment(caseData[i].manager.submittedDate).utc().format("YYYY-MM-DD") : "" : "";
                    row.getCell(23).value = caseData[i].manager ? caseData[i].manager.submittedDate ? moment(caseData[i].manager.submittedDate).utc().format("HH:mm:ss") : "" : "";
                    row.getCell(24).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.name ? caseData[i].seniorSupervisor.name : "" : ""
                    row.getCell(25).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.assignedDate ? moment(caseData[i].seniorSupervisor.assignedDate).utc().format("YYYY-MM-DD") : "" : "";
                    row.getCell(26).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.assignedDate ? moment(caseData[i].seniorSupervisor.assignedDate).utc().format("HH:mm:ss") : "" : "";
                    row.getCell(27).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.submittedDate ? moment(caseData[i].seniorSupervisor.submittedDate).utc().format("YYYY-MM-DD") : "" : ""
                    row.getCell(28).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.submittedDate ? moment(caseData[i].seniorSupervisor.submittedDate).utc().format("HH:mm:ss") : "" : ""
                    row.getCell(29).value = caseData[i].supervisor ? caseData[i].supervisor.name ? caseData[i].supervisor.name : "" : ""
                    row.getCell(30).value = caseData[i].supervisor ? caseData[i].supervisor.assignedDate ? moment(caseData[i].supervisor.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                    row.getCell(31).value = caseData[i].supervisor ? caseData[i].supervisor.assignedDate ? moment(caseData[i].supervisor.assignedDate).utc().format("HH:mm:ss") : "" : ""
                    row.getCell(32).value = caseData[i].supervisor ? caseData[i].supervisor.submittedDate ? moment(caseData[i].supervisor.submittedDate).utc().format("YYYY-MM-DD") : "" : ""
                    row.getCell(33).value = caseData[i].supervisor ? caseData[i].supervisor.submittedDate ? moment(caseData[i].supervisor.submittedDate).utc().format("HH:mm:ss") : "" : ""
                    row.getCell(34).value = caseData[i].admin ? caseData[i].admin.name ? caseData[i].admin.name : "" : ""
                    row.getCell(35).value = caseData[i].admin ? caseData[i].admin.submittedDate ? moment(caseData[i].admin.submittedDate).utc().format("YYYY-MM-DD") : "" : ""
                    row.getCell(36).value = caseData[i].admin ? caseData[i].admin.submittedDate ? moment(caseData[i].admin.submittedDate).utc().format("HH:mm:ss") : "" : ""
                    row.getCell(37).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.name ? caseData[i].fieldExecutive.name : "" : ""
                    row.getCell(38).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                    row.getCell(39).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("HH:mm:ss") : "" : ""
                    row.getCell(40).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("YYYY-MM-DD") : "" : ""
                    row.getCell(41).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("HH:mm:ss") : "" : ""
                    row.getCell(42).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.submittedDate ? moment(caseData[i].fieldExecutive.submittedDate).utc().format("YYYY-MM-DD") : "" : ""
                    row.getCell(43).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.submittedDate ? moment(caseData[i].fieldExecutive.submittedDate).utc().format("HH:mm:ss") : "" : ""
                    row.getCell(44).value = caseData[i].distance ? caseData[i].distance : ""
                    row.getCell(45).value = caseData[i].caseStatus ? caseData[i].caseStatus : ""
                    row.getCell(46).value = caseData[i].caseStatusRemarks ? caseData[i].caseStatusRemarks : ""
                }
                row.commit();
                await workbook.xlsx.writeFile(`${fileUrl}newFile.xlsx`);
            })
        async function checkFile() {
            let g = url.pathToFileURL(`${fileUrl}newFile.xlsx`)
            if (fs.existsSync(`${fileUrl}newFile.xlsx`)) {
                let timeTaken = Date.now() - start;
               
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
export default teamEfficiencyExcel