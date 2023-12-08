import { Response, Router } from "express";
import Messages from "messages"
import path from "path";
import Excel from "exceljs"
// const fs = require('fs')
import fs from 'fs'
import { readFile } from 'fs'
import url from "url"
import fetch from "node-fetch"
const libre = require('libreoffice-convert')
libre.convertAsync = require('util').promisify(libre.convert);
import moment = require("moment");


let createExcelFile = async (caseData: any, x: any) => {

    const fileUrl = path.join(__dirname, "../public/excelFile/")
    try {
        let buffer
        async function downloadImage(image) {
            const response = await fetch(image);
            const arrayBuffer = await response.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
            return buffer
        }
        var workbook = new Excel.Workbook();
        if (caseData[0].addressType == "BV") {
            await workbook.xlsx.readFile(`${fileUrl}bv_file.xlsx`)
                .then(async function () {
                    var worksheet = workbook.getWorksheet(1);
                    var row = worksheet.getRow(1);
                    if (caseData[0].bank == "AU") {
                        const imageId1 = workbook.addImage({
                            filename: `${fileUrl}Capture12.PNG`,
                            extension: 'png',
                        });
                        worksheet.addImage(imageId1, '  D01:D01')
                    } else {
                        row.getCell(4).value = `${caseData[0].bank}`;
                    }

                    var row = worksheet.getRow(2);
                    if (caseData[0].dateVisit && !caseData[0].timeVisit) {
                        row.getCell(2).value = `${caseData[0].dateVisit ? moment(caseData[0].dateVisit, "DD/M/YYYY").utc().format("YYYY-MM-DD") : ""}`;
                    } else {

                        row.getCell(2).value = `${caseData[0].dateVisit ? moment(caseData[0].dateVisit, "DD/MM/YYYY").utc().format("YYYY-MM-DD") : ""}`;
                    }
                    row.getCell(4).value = `${caseData[0].timeVisit ? caseData[0].timeVisit : caseData[0].dateVisit ? moment(caseData[0].dateVisit).utc().format("HH:mm:ss") : ""}`;
                    var row = worksheet.getRow(3);
                    row.getCell(2).value = `${caseData[0].product}`;
                    row.getCell(4).value = `${caseData[0].fileNo}`;
                    var row = worksheet.getRow(4);
                    row.getCell(2).value = `${caseData[0].applicantName}`;
                    row.getCell(4).value = `${caseData[0].mobileNo}`;

                    var row = worksheet.getRow(5);
                    row.getCell(2).value = `${caseData[0].officeName}`;


                    var row = worksheet.getRow(6);
                    row.getCell(2).value = `${caseData[0].address}`;




                    var row = worksheet.getRow(7);
                    row.getCell(2).value = `${caseData[0].landMark}`;

                    var row = worksheet.getRow(8);
                    if (caseData[0].easeOfLocating == "EASY") {
                        row.getCell(2).value = `✔${row.getCell(2).value}`;
                    }
                    if (caseData[0].easeOfLocating == "DIFFICULT") {
                        row.getCell(3).value = `✔${row.getCell(3).value}`;
                    }
                    if (caseData[0].easeOfLocating == "UNTRACEABLE") {
                        row.getCell(4).value = `✔${row.getCell(4).value}`;
                    }
                    var row = worksheet.getRow(9);
                    row.getCell(2).value = `${caseData[0].officeSetup}`;
                    row.getCell(4).value = `${caseData[0].areaType}`;

                    var row = worksheet.getRow(10);


                    if (caseData[0].applicantOccupation === "SALARIED") {
                        row.getCell(3).value = `✔ ${row.getCell(3).value}`;
                    }

                    if (caseData[0].applicantOccupation === "SELF_EMPLOYED") {
                        row.getCell(4).value = `✔ ${row.getCell(4).value}`;
                    }


                    var row = worksheet.getRow(11);
                    row.getCell(2).value = `${caseData[0].contactedPersonName}`;
                    
                    if (caseData[0].contactedPersonDesignation == "OTHER") {
                        row.getCell(3).value = `${caseData[0].contactedPersonDesignationRemarks}`;
                    } else {
                        worksheet.mergeCells('C11:D11');
                        row.getCell(3).value = `${caseData[0].contactedPersonDesignation}`;
                    }
                    var row = worksheet.getRow(12);
                    if (caseData[0].applicantDesignation == "OTHER") {
                        row.getCell(2).value = `${caseData[0].applicantDesignationRemarks}` != "undefined" ? `${caseData[0].applicantDesignationRemarks}` : "";
                    } else {
                        row.getCell(2).value = `${caseData[0].applicantDesignation}` != "undefined" ? `${caseData[0].applicantDesignation}` : "";
                    }

                    var row = worksheet.getRow(13);
                    if (caseData[0].applicantDesignation == "OTHER") {

                        row.getCell(2).value = `${caseData[0].applicantDesignationRemarks}` != "undefined" ? `${caseData[0].applicantDesignationRemarks}` : "";
                    } else {
                        row.getCell(2).value = `${caseData[0].applicantDesignation}` != "undefined" ? `${caseData[0].applicantDesignation}` : "";
                    }
                    var row = worksheet.getRow(14);
                    row.getCell(2).value = `${caseData[0].workingFrom}`;

                    var row = worksheet.getRow(18);
                    if (caseData[0].premisesBusiness == "SELF_OWNED") {
                        row.getCell(2).value = `✔${row.getCell(2).value}`;
                    }
                    if (caseData[0].premisesBusiness == "RENTED") {
                        row.getCell(3).value = `✔${row.getCell(3).value}`;
                    }
                    if (caseData[0].premisesBusiness == "LEASE") {
                        row.getCell(4).value = `✔${row.getCell(4).value}`;
                    }
                    var row = worksheet.getRow(19);
                    if (caseData[0].premisesBusiness == "SHARED") {
                        row.getCell(2).value = `✔${row.getCell(2).value}`;
                    }
                    if (caseData[0].premisesBusiness == "BUSINESS_CENTRE") {
                        row.getCell(3).value = `✔${row.getCell(3).value}`;
                    }
                    if (caseData[0].premisesBusiness == "COMPANY_OWNED") {
                        row.getCell(4).value = `✔${row.getCell(4).value}`;
                    }
                    var row = worksheet.getRow(20);
                    if (caseData[0].premisesBusiness == "LOAN") {
                        row.getCell(2).value = `✔${row.getCell(2).value}`;
                    }
                    var row = worksheet.getRow(20);
                    if (caseData[0].premisesBusiness == "OTHER") {
                        row.getCell(3).value = `✔${row.getCell(2).value}`;
                        row.getCell(4).value = `${caseData[0].premisesBusinessRemarks}`;
                    }
                    var row = worksheet.getRow(21);
                    row.getCell(2).value = `${caseData[0].workingFrom}`;

                    var row = worksheet.getRow(23);
                    if (caseData[0].natureOfBusiness == "TRADING") {
                        row.getCell(2).value = `✔${row.getCell(2).value}`;
                    }
                    if (caseData[0].natureOfBusiness == "MANUFACTURING") {
                        row.getCell(3).value = `✔${row.getCell(3).value}`;
                    }
                    if (caseData[0].natureOfBusiness == "SERVICE") {
                        row.getCell(4).value = `✔${row.getCell(4).value}`;
                    }
                    var row = worksheet.getRow(24);
                    if (caseData[0].natureOfBusiness == "JOB_WORK") {
                        row.getCell(2).value = `✔${row.getCell(2).value}`;
                    }
                    if (caseData[0].natureOfBusiness == "COMMISSION_AGENT") {
                        row.getCell(3).value = `✔${row.getCell(3).value}`;
                    }
                    if (caseData[0].natureOfBusiness == "OTHER") {
                        row.getCell(4).value = `✔${row.getCell(4).value}  ${caseData[0].natureOfBusinessRemarks}`;
                    }
                    var row = worksheet.getRow(25);
                    if (caseData[0].businessBoard == "YES") {
                        row.getCell(2).value = `✔${row.getCell(2).value}`;
                    }
                    if (caseData[0].businessBoard == "NO") {
                        row.getCell(3).value = `✔${row.getCell(3).value}`;
                    }
                    var row = worksheet.getRow(26);
                    row.getCell(2).value = `${caseData[0].noOfEmployees}`;

                    var row = worksheet.getRow(27);
                    if (caseData[0].stock == "HIGH") {
                        row.getCell(2).value = `✔${row.getCell(2).value}`;
                    }
                    if (caseData[0].stock == "MEDIUM") {
                        row.getCell(3).value = `✔${row.getCell(3).value}`;
                    }
                    if (caseData[0].stock == "LOW") {
                        row.getCell(4).value = `✔${row.getCell(4).value}`;
                    }
                    var row = worksheet.getRow(28);
                    if (caseData[0].businessActivity == "HIGH") {
                        row.getCell(2).value = `✔${row.getCell(2).value}`;
                    }
                    if (caseData[0].businessActivity == "MEDIUM") {
                        row.getCell(3).value = `✔${row.getCell(3).value}`;
                    }
                    if (caseData[0].businessActivity == "LOW") {
                        row.getCell(4).value = `✔${row.getCell(4).value}`;
                    }
                    var row = worksheet.getRow(29);
                    row.getCell(3).value = `${caseData[0].contactedPersonName ? caseData[0].contactedPersonName : ""}`;
                    var row = worksheet.getRow(30);
                    if (caseData[0].contactedPersonDesignation == "OTHER") {
                        row.getCell(3).value = `${caseData[0].contactedPersonDesignationRemarks}`;
                    } else {
                        row.getCell(3).value = `${caseData[0].contactedPersonDesignation}`;
                    }
                    var row = worksheet.getRow(32);
                    row.getCell(3).value = `${caseData[0].neighbourCheck1 ? caseData[0].neighbourCheck1 : ""}`;
                    row.getCell(4).value = `${caseData[0].neighbourCheck2 ? caseData[0].neighbourCheck2 : ""}`;
                    var row = worksheet.getRow(33);
                    row.getCell(3).value = `${caseData[0].neighbourCheck1Remarks ? caseData[0].neighbourCheck1Remarks : ""}`;
                    row.getCell(4).value = `${caseData[0].neighbourCheck2Remarks ? caseData[0].neighbourCheck2Remarks : ""}`;

                    var row = worksheet.getRow(38);
                    let remarks = "";
                    remarks = "GIVEN ADDRESS CONFIRM" + `${caseData[0].addressConfirm} `
                    if (caseData[0].applicantAge) {
                        remarks = `${remarks}` + ` APPLICANT AGE  ${caseData[0].applicantAge} `
                    } else {
                        remarks = `${remarks}` + ` APPLICANT AGE  NA `
                    }
                    if (caseData[0].contactedPersonName) {
                        remarks = `${remarks}` + `PERSON MET ${caseData[0].contactedPersonName} ${caseData[0].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "").replace("OTHER", "")} ${caseData[0].contactedPersonDesignationRemarks ? caseData[0].contactedPersonDesignationRemarks : ""} `
                    } else {
                        remarks = `${remarks}` + `PERSON MET NA `
                    }
                    if (caseData[0].natureOfBusiness) {
                        remarks = `${remarks}` + `NATURE OF WORK ${caseData[0].natureOfBusiness.replace(/[^a-zA-Z0-9 ]/g, "").replace("OTHER", "")} ${caseData[0].natureOfBusinessRemarks ? caseData[0].natureOfBusinessRemarks : ""} ${caseData[0].nOfBR2 ? caseData[0].nOfBR2 : ""} `
                    } else {
                        remarks = `${remarks}` + `NATURE OF WORK NA `
                    }
                    if (caseData[0].workingFrom) {
                        remarks = remarks + `WORKING YEAR  ${caseData[0].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `
                    } else {
                        remarks = remarks + `WORKING YEAR  NA `
                    }
                    if (caseData[0].applicantDesignation) {
                        remarks = remarks + `DESIGNATION ${caseData[0].applicantDesignation.replace(/[^a-zA-Z0-9 ]/g, "").replace("OTHER", "")} ${caseData[0].applicantDesignationRemarks ? caseData[0].applicantDesignationRemarks : ""} `
                    } else {
                        remarks = remarks + `DESIGNATION NA `
                    }
                    if (caseData[0].applicantOccupation == "SALARIED") {
                        remarks = remarks + `SALARY ${caseData[0].totalIncome ? caseData[0].totalIncome : "NA"} `
                    }
                    else {
                        remarks = remarks + `INCOME  ${caseData[0].totalIncome ? caseData[0].totalIncome : "NA"} `
                    }

                    remarks = remarks + `BUSINESS BOARD SEEN  ${caseData[0].businessBoard ? caseData[0].businessBoard : "NA"} `

                    if (caseData[0].businessBoardNameConfirmation) {
                        remarks = remarks + `SAME NAME  ${caseData[0].businessBoardNameConfirmation} ${caseData[0].businessBoardNameRemarks ? caseData[0].businessBoardNameRemarks : ""} `
                    } else {
                        remarks = remarks + `SAME NAME  NA `
                    }
                    if (caseData[0].businessActivitySeen) {
                        remarks = remarks + `WORKING ACTIVITY SEEN  ${caseData[0].businessActivitySeen} ${caseData[0].businessActivity} `
                    }
                    else {
                        remarks = remarks + `WORKING ACTIVITY SEEN  NA `
                    }
                    if (caseData[0].stockSeen) {
                        remarks = remarks + `STOCK SEEN  ${caseData[0].stockSeen} ${caseData[0].stock ? caseData[0].stock : ""} `
                    }
                    else {
                        remarks = remarks + `STOCK SEEN  NA `
                    }
                    if (caseData[0].noOfEmployees) {
                        remarks = remarks + `NO OF EMPLOYEES  ${caseData[0].noOfEmployees ? caseData[0].noOfEmployees : ""} `
                    }
                    else {
                        remarks = remarks + `NO OF EMPLOYEES  NA`
                    }
                    if (caseData[0].premisesBusiness) {
                        remarks = remarks + `OFFICE PREMISES ${caseData[0].premisesBusiness.replace(/[^a-zA-Z0-9 ]/g, "").replace("OTHER", "")}  ${caseData[0].premisesBusinessRemarks ? caseData[0].premisesBusinessRemarks : ""} `
                    }
                    else {
                        remarks = remarks + `OFFICE PREMISES  NA `
                    }
                    remarks = remarks + `ADDITIONAL REMARK ${caseData[0].remarks ? caseData[0].remarks : "NA"} `;
                    if (caseData[0].neighbourCheck1) {
                        remarks = remarks + `NEIGHBOUR CHECK  NAME1 ${caseData[0].neighbourCheck1} ${caseData[0].neighbourCheck1Remarks} NAME2 ${caseData[0].neighbourCheck2} ${caseData[0].neighbourCheck2Remarks} `
                    }
                    else {
                        remarks = remarks + `NEIGHBOUR CHECK  NA `
                    }
                    if (caseData[0].distance) {
                        remarks = remarks + `DISTANCE FROM BRANCH  ${caseData[0].distance}`
                    }
                    else {
                        remarks = remarks + `DISTANCE FROM BRANCH  NA `
                    }
                    if (caseData[0].caseStatus) {
                        remarks = remarks + `STATUS  ${caseData[0].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[0].caseStatusRemarks ? caseData[0].caseStatusRemarks : ""} `
                    }
                    else {
                        remarks = remarks + `STATUS  NA `
                    }
                    if (caseData[0].lat) { remarks = remarks + `LAT LON ${caseData[0].lat} ${caseData[0].long} ` }
                    else {
                        remarks = remarks + `LAT LON  NA `
                    }
                    row.getCell(2).value = remarks;


                    var row = worksheet.getRow(41);
                    if (caseData[0].caseStatus == "POSITIVE") {
                        row.getCell(2).value = `✔${row.getCell(2).value}`
                    }
                    if (caseData[0].caseStatus == "NEGATIVE") {
                        row.getCell(3).value = `✔${row.getCell(3).value}:${caseData[0].caseStatusRemarks}`
                    }
                    if (caseData[0].caseStatus == "REFER_TO_CREDIT") {
                        row.getCell(4).value = `✔${row.getCell(4).value}:${caseData[0].caseStatusRemarks}`
                    }
                    var row = worksheet.getRow(42);
                    row.getCell(2).value = `${caseData[0].fieldExecutiveId ? caseData[0].fieldExecutiveId[0] ? caseData[0].fieldExecutiveId[0].fullName : "" : ""}`;

                    var row = worksheet.getRow(43);
                    row.getCell(2).value = `${caseData[0].managerId ? caseData[0].managerId[0] ? caseData[0].managerId[0].fullName : "" : ""}`;

                    var row = worksheet.getRow(44);
                    row.getCell(2).value = `${caseData[0].agencyName} `;

                    var row = worksheet.getRow(45);
                    if (caseData[0].agencyName == "CMB_MANAGEMENT_SOLUTION_PVT_LTD") {
                        const imageId1 = workbook.addImage({
                            filename: path.join(__dirname, "../public/agencySeal/CMB.jpg"),
                            extension: 'jpeg',
                        });
                        worksheet.addImage(imageId1, 'C45:C45')
                    }
                    if (caseData[0].agencyName == "MB_MANAGEMENT") {
                        const imageId1 = workbook.addImage({
                            filename: path.join(__dirname, "../public/agencySeal/MB.jpg"),
                            extension: 'jpeg',
                        });
                        worksheet.addImage(imageId1, 'C45:C45')

                    }
                    if (caseData[0].agencyName == "TIME_MANAGEMENT_SERVICES") {
                        const imageId1 = workbook.addImage({
                            filename: path.join(__dirname, "../public/agencySeal/TIME.jpg"),
                            extension: 'jpeg',
                        });
                        worksheet.addImage(imageId1, 'C45:C45')
                    }


                    var row = worksheet.getRow(46);
                    if (x.length > 0) {
                        if (x[0]) {
                            const imageId1 = workbook.addImage({
                                buffer: await downloadImage(x[0]),
                                extension: 'png',
                            });
                            worksheet.addImage(imageId1, 'A46:B46')
                        }
                        if (x[1]) {
                            const imageId1 = workbook.addImage({
                                buffer: await downloadImage(x[1]),
                                extension: 'png',
                            });
                            worksheet.addImage(imageId1, 'C46:D46')
                        }
                        if (x[2]) {
                            const imageId1 = workbook.addImage({
                                buffer: await downloadImage(x[2]),
                                extension: 'png',
                            });
                            worksheet.addImage(imageId1, 'A47:B47')
                        }
                        if (x[3]) {
                            const imageId1 = workbook.addImage({
                                buffer: await downloadImage(x[3]),
                                extension: 'png',
                            });
                            worksheet.addImage(imageId1, 'C47:D47')
                        }
                    }

                    row.commit();
                    await workbook.xlsx.writeFile(`${fileUrl}newFile.xlsx`);

                })
        } else {
            await workbook.xlsx.readFile(`${fileUrl}rv_file.xlsx`)
                .then(async function () {
                    var worksheet = workbook.getWorksheet(1);
                    var row = worksheet.getRow(1);
                    if (caseData[0].addressType == "RV") {
                        row.getCell(2).value = `Residence Verification Report`;
                    } else {
                        row.getCell(2).value = `Personal Verification Report `;
                    }
                    var row = worksheet.getRow(1);
                    if (caseData[0].bank == "AU") {
                        const imageId1 = workbook.addImage({
                            filename: `${fileUrl}Capture12.PNG`,
                            extension: 'png',
                        });
                        worksheet.addImage(imageId1, '  D01:D01')
                    } else {
                        row.getCell(4).value = `${caseData[0].bank}`;
                    }
                    var row = worksheet.getRow(2);
                    if (caseData[0].dateVisit && !caseData[0].timeVisit) {
                        row.getCell(2).value = `${caseData[0].dateVisit ? moment(caseData[0].dateVisit, "DD/M/YYYY").utc().format("YYYY-MM-DD") : ""}`;
                    } else {

                        row.getCell(2).value = `${caseData[0].dateVisit ? moment(caseData[0].dateVisit, "DD/MM/YYYY").utc().format("YYYY-MM-DD") : ""}`;
                    }
                    row.getCell(4).value = `${caseData[0].timeVisit ? caseData[0].timeVisit : caseData[0].dateVisit ? moment(caseData[0].dateVisit).utc().format("HH:mm:ss") : ""}`;
                    var row = worksheet.getRow(3);
                    row.getCell(2).value = `${caseData[0].product} `;
                    row.getCell(4).value = `${caseData[0].fileNo} `;
                    var row = worksheet.getRow(4);
                    row.getCell(2).value = `${caseData[0].applicantName} `;
                    row.getCell(4).value = `${caseData[0].mobileNo} `;
                    var row = worksheet.getRow(5);
                    row.getCell(2).value = `${caseData[0].address} `;
                    var row = worksheet.getRow(6);
                    row.getCell(2).value = `${caseData[0].landMark} `;
                    var row = worksheet.getRow(7);
                    row.getCell(2).value = `${caseData[0].contactedPersonName} `;
                    ;
                    if (caseData[0].contactedPersonDesignation == "OTHER") {
                        row.getCell(3).value = `${caseData[0].contactedPersonDesignationRemarks} `;
                    } else {
                        worksheet.mergeCells('C7:D7');
                        row.getCell(3).value = `${caseData[0].contactedPersonDesignation} `;
                    }
                    var row = worksheet.getRow(8);
                    row.getCell(2).value = `${caseData[0].applicantOccupation} `;

                    var row = worksheet.getRow(9);
                    if (caseData[0].easeOfLocating == "EASY") {
                        row.getCell(2).value = `✔${row.getCell(2).value} `;
                    }
                    if (caseData[0].easeOfLocating == "DIFFICULT") {
                        row.getCell(3).value = `✔${row.getCell(3).value} `;
                    }
                    if (caseData[0].easeOfLocating == "UNTRACEABLE") {
                        row.getCell(4).value = `✔${row.getCell(4).value} `;
                    }

                    var row = worksheet.getRow(10);
                    if (caseData[0].premisesResidence == "RENTED") {
                        row.getCell(2).value = `✔${row.getCell(2).value} `;
                    }
                    if (caseData[0].premisesResidence == "LEASE") {
                        row.getCell(3).value = `✔${row.getCell(3).value} `;
                    }
                    if (caseData[0].premisesResidence == "BUSINESS_CENTRE") {
                        row.getCell(4).value = `✔${row.getCell(4).value} `;
                    }

                    var row = worksheet.getRow(11);
                    if (caseData[0].premisesResidence == "LOAN") {
                        row.getCell(2).value = `✔${row.getCell(2).value} `;
                    }
                    if (caseData[0].premisesResidence == "SELF_OWNED") {
                        row.getCell(3).value = `✔${row.getCell(3).value} `;
                    }
                    if (caseData[0].premisesResidence == "SHARED") {
                        row.getCell(4).value = `✔${row.getCell(4).value} `;
                    }

                    var row = worksheet.getRow(12);
                    if (caseData[0].premisesResidence == "PARENTAL") {
                        row.getCell(2).value = `✔${row.getCell(2).value} `;
                    }
                    if (caseData[0].premisesResidence == "COMPANY_OWNED") {
                        row.getCell(3).value = `✔${row.getCell(3).value} `;
                    }
                    if (caseData[0].premisesResidence == "OTHER") {
                        row.getCell(4).value = `other: -${caseData[0].premisesResidenceRemarks} `;
                    }
                    var row = worksheet.getRow(14);
                    row.getCell(2).value = `${caseData[0].workingFrom} `;

                    var row = worksheet.getRow(16);
                    if (caseData[0].businessBoard == "YES") {
                        row.getCell(2).value = `✔${row.getCell(2).value} `;
                    }
                    if (caseData[0].neighbourCheck1Remarks == "POSITIVE" || caseData[0].neighbourCheck2Remarks == "POSITIVE") {
                        row.getCell(3).value = `✔${row.getCell(3).value} `;
                    }
                    var row = worksheet.getRow(17);
                    if (caseData[0].addressConfirm == "YES" && caseData[0].officeLock == "NO") {
                        row.getCell(2).value = `✔${row.getCell(2).value} `;
                    }
                    if (caseData[0].addressConfirm == "YES" && caseData[0].officeLock == "YES" || caseData[0].addressConfirm == "NO") {
                        row.getCell(3).value = `✔${row.getCell(3).value} `;
                    }
                    var row = worksheet.getRow(19);
                    if (caseData[0].typeOfResi == "INDEPENDENT_HOUSE") {
                        row.getCell(2).value = `✔${row.getCell(2).value} `;
                    }
                    if (caseData[0].typeOfResi == "FLAT") {
                        row.getCell(3).value = `✔${row.getCell(3).value} `;
                    }
                    if (caseData[0].typeOfResi == "CHAWL") {
                        row.getCell(4).value = `✔${row.getCell(4).value} `;
                    }

                    var row = worksheet.getRow(20);
                    if (caseData[0].typeOfResi == "BUNGALOW") {
                        row.getCell(2).value = `✔${row.getCell(2).value} `;
                    }
                    if (caseData[0].typeOfResi == "RAW_HOUSE") {
                        row.getCell(3).value = `✔${row.getCell(3).value} `;
                    }
                    if (caseData[0].typeOfResi == "TEMPORARY_HOUSE") {
                        row.getCell(4).value = `✔${row.getCell(4).value} `;
                    }

                    var row = worksheet.getRow(21);
                    if (caseData[0].typeOfResi == "OTHER") {
                        row.getCell(2).value = `other: -${caseData[0].typeOfResiRemarks} `;

                    }
                    var row = worksheet.getRow(22);
                    row.getCell(2).value = `${caseData[0].areaLocality} `;
                    var row = worksheet.getRow(23);
                    row.getCell(2).value = `${caseData[0].noOfFMember} `;
                    var row = worksheet.getRow(24);
                    row.getCell(2).value = `${caseData[0].noEarningMember} `;



                    var row = worksheet.getRow(26);
                    row.getCell(2).value = `${caseData[0].neighbourCheck1} `;
                    row.getCell(3).value = `${caseData[0].neighbourCheck2} `;
                    var row = worksheet.getRow(27);
                    row.getCell(2).value = `${caseData[0].neighbourCheck1Remarks} `;
                    row.getCell(3).value = `${caseData[0].neighbourCheck2Remarks} `;


                    var row = worksheet.getRow(35);
                    let remarks = "";
                    remarks = `GIVEN ADDRESS CONFIRM ${caseData[0].addressConfirm} `
                    if (caseData[0].applicantAge) {
                        remarks = `${remarks}` + ` APPLICANT AGE  ${caseData[0].applicantAge} `
                    } else {
                        remarks = `${remarks}` + ` APPLICANT AGE  NA `
                    }
                    if (caseData[0].contactedPersonName) {
                        remarks = `${remarks}` + `PERSON MET ${caseData[0].contactedPersonName} ${caseData[0].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "").replace("OTHER", "")} ${caseData[0].contactedPersonDesignationRemarks ? caseData[0].contactedPersonDesignationRemarks : ""} `
                    } else {
                        remarks = `${remarks}` + `PERSON MET NA `
                    }

                    if (caseData[0].premisesResidence) {
                        remarks = remarks + `RESIDENCE OWNERSHIP  PREMISES ${caseData[0].premisesResidence.replace(/[^a-zA-Z0-9 ]/g, "").replace("OTHER", "")} ${caseData[0].premisesResidenceRemarks ? caseData[0].premisesResidenceRemarks : ""} LOCATION OF RESIDENCE ${caseData[0].locationOfResi.replace(/[^a-zA-Z0-9 ]/g, "")}  TYPE OF RESIDENCE ${caseData[0].typeOfResi.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[0].typeOfResiRemarks ? caseData[0].typeOfResiRemarks : ""}  AREA LOCALITY ${caseData[0].areaLocality.replace(/[^a-zA-Z0-9 ]/g, "")} `
                    } else {
                        remarks = remarks + `RESIDENCE OWNERSHIP  NA `
                    }

                    if (caseData[0].workingFrom) {
                        remarks = remarks + `NO OF YEAR STAY ${caseData[0].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `
                    }
                    else {
                        remarks = remarks + `NO OF YEAR STAY  NA `
                    }
                    if (caseData[0].noOfFMember) {
                        remarks = remarks + `FAMILY MEMBER ${caseData[0].noOfFMember} `
                    } else {
                        remarks = remarks + `FAMILY MEMBER  NA `
                    }
                    if (caseData[0].noEarningMember) {
                        remarks = remarks + `EARNING MEMBER ${caseData[0].noEarningMember} `
                    } else {
                        remarks = remarks + `EARNING MEMBER NA `
                    }
                    if (caseData[0].maritalStatus) {
                        remarks = remarks + `MARITIAL STATUS ${caseData[0].maritalStatus.replace(/[^a-zA-Z0-9 ]/g, "")} `
                    } else {
                        remarks = remarks + `MARITIAL STATUS NA `
                    }

                    if (caseData[0].isSpouseWorking == "YES") {
                        remarks = remarks + `SPOUSE WORKING DETAIL WORKING PLACE ${caseData[0].spouseWorkingPlace}  WORKING SINCE ${caseData[0].spouseWorkingSince.replace(/[^a-zA-Z0-9 ]/g, "")}  SALARY  ${caseData[0].spouseSalary} `
                    } else {
                        remarks = remarks + `SPOUSE WORKING DETAIL  NA `
                    }

                    if (caseData[0].vehicle) {
                        remarks = remarks + `VEHICLE DETAIL ${caseData[0].vehicle} ${caseData[0].vehicleRemarks ? caseData[0].vehicleRemarks : ""} `
                    } else {
                        remarks = remarks + `VEHICLE DETAIL NA `
                    }
                    if (caseData[0].houseArea) {
                        remarks = remarks + `OBSERVATION DETAIL HOUSE AREA ${caseData[0].houseArea} INTERIOR CONDITION ${caseData[0].resiInterior.replace(/[^a-zA-Z0-9 ]/g, "")} EXTERIOR CONDITION ${caseData[0].resiExterior.replace(/[^a-zA-Z0-9 ]/g, "")} HOUSE CONDITION ${caseData[0].houseCondition.replace(/[^a-zA-Z0-9 ]/g, "")} `
                    } else {
                        remarks = remarks + `OBSERVATION DETAIL  NA `
                    }
                    if (caseData[0].remarks) {
                        remarks = remarks + `AGRI DETAIL ${caseData[0].remarks} `
                    }
                    else {
                        remarks = remarks + `AGRI DETAIL NA `
                    }
                    if (caseData[0].neighbourCheck1) {
                        remarks = remarks + `NEIGHBOUR CHECK NAME1 ${caseData[0].neighbourCheck1} ${caseData[0].neighbourCheck1Remarks} NAME2 ${caseData[0].neighbourCheck2} ${caseData[0].neighbourCheck2Remarks} `
                    } else { remarks = remarks + `NEIGHBOUR CHECK NA` }

                    if (caseData[0].distance) {
                        remarks = remarks + `DISTANCE FROM BRANCH ${caseData[0].distance} `
                    } else {
                        remarks + remarks + `DISTANCE FROM BRANCH  NA `
                    }

                    if (caseData[0].caseStatus) {
                        remarks = remarks + `STATUS ${caseData[0].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[0].caseStatusRemarks ? caseData[0].caseStatusRemarks : ""} `
                    } else {
                        remarks = remarks + `STATUS NA `
                    }

                    if (caseData[0].lat) {
                        remarks = remarks + `LAT LON ${caseData[0].lat}${caseData[0].long} `
                    } else {
                        remarks = remarks + `LAT LON NA`
                    }
                    row.getCell(2).value = remarks




                    var row = worksheet.getRow(38);
                    if (caseData[0].caseStatus == "POSITIVE") {
                        row.getCell(2).value = `✔${row.getCell(2).value}`
                    }
                    if (caseData[0].caseStatus == "NEGATIVE") {
                        row.getCell(3).value = `✔${row.getCell(3).value}:${caseData[0].caseStatusRemarks}`
                    }
                    if (caseData[0].caseStatus == "REFER_TO_CREDIT") {
                        row.getCell(4).value = `✔${row.getCell(4).value}:${caseData[0].caseStatusRemarks}`
                    }


                    var row = worksheet.getRow(39);
                    row.getCell(2).value = `${caseData[0].fieldExecutiveId ? caseData[0].fieldExecutiveId[0] ? caseData[0].fieldExecutiveId[0].fullName : "" : ""} `;

                    var row = worksheet.getRow(40);
                    row.getCell(2).value = `${caseData[0].managerId ? caseData[0].managerId[0] ? caseData[0].managerId[0].fullName : "" : ""}`;

                    var row = worksheet.getRow(41);
                    row.getCell(2).value = `${caseData[0].agencyName} `;
                    var row = worksheet.getRow(42);
                    if (caseData[0].agencyName == "CMB_MANAGEMENT_SOLUTION_PVT_LTD") {
                        const imageId1 = workbook.addImage({
                            filename: path.join(__dirname, "../public/agencySeal/CMB.jpg"),
                            extension: 'jpeg',
                        });
                        worksheet.addImage(imageId1, 'C42:C42')
                    }
                    if (caseData[0].agencyName == "MB_MANAGEMENT") {
                        const imageId1 = workbook.addImage({
                            filename: path.join(__dirname, "../public/agencySeal/MB.jpg"),
                            extension: 'jpeg',
                        });
                        worksheet.addImage(imageId1, 'C42:C42')

                    }
                    if (caseData[0].agencyName == "TIME_MANAGEMENT_SERVICES") {
                        const imageId1 = workbook.addImage({
                            filename: path.join(__dirname, "../public/agencySeal/TIME.jpg"),
                            extension: 'jpeg',
                        });
                        worksheet.addImage(imageId1, 'C42:C42')
                    }
                    var row = worksheet.getRow(46);
                    if (x.length > 0) {
                        if (x[0]) {
                            const imageId1 = workbook.addImage({
                                buffer: await downloadImage(x[0]),
                                extension: 'png',
                            });
                            worksheet.addImage(imageId1, 'A44:B44')
                        }
                        if (x[1]) {
                            const imageId1 = workbook.addImage({
                                buffer: await downloadImage(x[1]),
                                extension: 'png',
                            });
                            worksheet.addImage(imageId1, 'C44:D44')
                        }
                        if (x[2]) {
                            const imageId1 = workbook.addImage({
                                buffer: await downloadImage(x[2]),
                                extension: 'png',
                            });
                            worksheet.addImage(imageId1, 'A46:B46')
                        }
                        if (x[3]) {
                            const imageId1 = workbook.addImage({
                                buffer: await downloadImage(x[3]),
                                extension: 'png',
                            });
                            worksheet.addImage(imageId1, 'C46:D46')
                        }
                    }
                    row.commit();
                    await workbook.xlsx.writeFile(`${fileUrl}newFile.xlsx`);
                })
        }
        async function checkFile() {
            let g = url.pathToFileURL(`${fileUrl}newFile.xlsx`)
            if (fs.existsSync(`${fileUrl}newFile.xlsx`)) {
                return Messages.SUCCESS.UPDATED_SUCCESSFULLY
            } else {
                await checkFile()
            }
        }

        return await checkFile()
        return Messages.SUCCESS.UPDATED_SUCCESSFULLY
    }
    catch (error) {

        return Messages.Failed.SOMETHING_WENT_WRONG
    }
}
export default createExcelFile





