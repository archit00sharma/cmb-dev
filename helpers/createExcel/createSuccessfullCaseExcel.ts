import { Response, Router } from "express";
import Messages from "messages"
import path from "path";
import Excel from "exceljs"
import fs from 'fs'
import { readFile } from 'fs'
import url from "url"
import moment from "moment"

let createSuccessfullCaseExcel = async (caseData: any, role) => {
    try {

        const fileUrl = path.join(__dirname, "../../public/succEx/")
        var workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(`${fileUrl}myFile.xlsx`)
            .then(async function () {
                var worksheet = workbook.getWorksheet(1)
                if (role == "manager") {
                    worksheet.spliceColumns(19, 5)
                    worksheet.spliceColumns(29, 3)
                }
                if (role == "senior-supervisor") {
                    worksheet.spliceColumns(19, 10)
                    worksheet.spliceColumns(24, 3)
                }
                if (role == "supervisor") {
                    worksheet.spliceColumns(19, 18)
                }
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

                    if (role === 'admin') {
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
                        let remarks = "";
                        if (caseData[i].addressType == "BV") {
                            remarks = `GIVEN ADDRESS CONFIRM  ${caseData[i].addressConfirm} `
                            if (caseData[i].applicantAge) {
                                remarks = `${remarks}` + ` APPLICANT AGE  ${caseData[i].applicantAge} `
                            } else {
                                remarks = `${remarks}` + ` APPLICANT AGE  NA `
                            }
                            if (caseData[i].contactedPersonName) {
                                remarks = `${remarks}` + ` PERSON MET ${caseData[i].contactedPersonName}  ${caseData[i].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "")}  ${caseData[i].contactedPersonDesignationRemarks ? caseData[i].contactedPersonDesignationRemarks : ""} `
                            } else {
                                remarks = `${remarks}` + ` PERSON MET NA `
                            }
                            if (caseData[i].natureOfBusiness) {
                                remarks = `${remarks}` + ` NATURE OF WORK  ${caseData[i].natureOfBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].natureOfBusinessRemarks} ${caseData[i].nOfBR2} `
                            } else {
                                remarks = `${remarks}` + ` NATURE OF WORK  NA `
                            }
                            if (caseData[i].workingFrom) {
                                remarks = remarks + ` WORKING YEAR  ${caseData[i].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + ` WORKING YEAR  NA `
                            }
                            if (caseData[i].applicantDesignation) {
                                remarks = remarks + ` DESIGNATION  ${caseData[i].applicantDesignation.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].applicantDesignationRemarks ? caseData[i].applicantDesignationRemarks : ""} `
                            } else {
                                remarks = remarks + ` DESIGNATION  NA `
                            }
                            if (caseData[i].applicantOccupation == "SALARIED") {
                                remarks = remarks + ` SALARY  ${caseData[i].totalIncome ? caseData[i].totalIncome : "NA"} `
                            }
                            else {
                                remarks = remarks + ` INCOME  ${caseData[i].totalIncome ? caseData[i].totalIncome : "NA"} `
                            }
                            remarks = remarks + ` BUSINESS BOARD SEEN  ${caseData[i].businessBoard ? caseData[i].businessBoard.replace(/[^a-zA-Z0-9 ]/g, "") : "NA"}`
                            if (caseData[i].businessBoardNameConfirmation) {
                                remarks = remarks + ` SAME NAME  ${caseData[i].businessBoardNameConfirmation}${caseData[i].businessBoardNameRemarks ? caseData[i].businessBoardNameRemarks : ""} `
                            } else {
                                remarks = remarks + `SAME NAME  NA `
                            }
                            if (caseData[i].businessActivitySeen) {
                                remarks = remarks + `WORKING ACTIVITY SEEN  ${caseData[i].businessActivitySeen} ${caseData[i].businessActivity} `
                            }
                            else {
                                remarks = remarks + `WORKING ACTIVITY SEEN  NA `
                            }
                            if (caseData[i].stockSeen) {
                                remarks = remarks + `STOCK SEEN ${caseData[i].stockSeen}  ${caseData[i].stock} `
                            }
                            else {
                                remarks = remarks + `STOCK SEEN  NA `
                            }
                            if (caseData[i].noOfEmployees) {
                                remarks = remarks + `NO OF EMPLOYEES  ${caseData[i].noOfEmployees} `
                            }
                            else {
                                remarks = remarks + `NO OF EMPLOYEES  NA `
                            }
                            if (caseData[i].premisesBusiness) {
                                remarks = remarks + `OFFICE PREMISES  ${caseData[i].premisesBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].premisesBusinessRemarks ? caseData[i].premisesBusinessRemarks : ""} `
                            }
                            else {
                                remarks = remarks + `OFFICE PREMISES   NA `
                            }
                            remarks = remarks + `ADDITIONAL REMARK ${caseData[i].remarks ? caseData[i].remarks : "NA"} `;
                            if (caseData[i].neighbourCheck1) {
                                remarks = remarks + `NEIGHBOUR CHECK NAME1 ${caseData[i].neighbourCheck1} ${caseData[i].neighbourCheck1Remarks} NAME2 ${caseData[i].neighbourCheck2} ${caseData[i].neighbourCheck2Remarks} `
                            }
                            else {
                                remarks = remarks + `NEIGHBOUR CHECK  NA `
                            }
                            if (caseData[i].distance) {
                                remarks = remarks + `DISTANCE FROM BRANCH  ${caseData[i].distance} `
                            }
                            else {
                                remarks = remarks + `DISTANCE FROM  BRANCH  NA `
                            }
                            if (caseData[i].caseStatus) {
                                remarks = remarks + `STATUS  ${caseData[i].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].caseStatusRemarks ? caseData[i].caseStatusRemarks : ""} `
                            }
                            else {
                                remarks = remarks + `STATUS  NA `
                            }
                            if (caseData[i].lat) { remarks = remarks + `LAT LON ${caseData[i].lat} ${caseData[i].long} ` }
                            else {
                                remarks = remarks + `LAT LON  NA `
                            }
                        } else {
                            remarks = `GIVEN ADDRESS CONFIRM  ${caseData[i].addressConfirm} `
                            if (caseData[i].applicantAge) {
                                remarks = `${remarks}` + ` APPLICANT AGE  ${caseData[i].applicantAge} `
                            } else {
                                remarks = `${remarks}` + ` APPLICANT AGE  NA `
                            }
                            if (caseData[i].contactedPersonName) {
                                remarks = `${remarks}` + `PERSON MET  ${caseData[i].contactedPersonName} ${caseData[i].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].contactedPersonDesignationRemarks ? caseData[i].contactedPersonDesignationRemarks : ""} `
                            } else {
                                remarks = `${remarks}` + `PERSON MET  NA `
                            }
                            if (caseData[i].premisesResidence) {
                                remarks = remarks + `RESIDENCE OWNERSHIP  PREMISES  ${caseData[i].premisesResidence.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].premisesResidenceRemarks ? caseData[i].premisesResidenceRemarks : ""} LOCATION OF RESIDENCE  ${caseData[i].locationOfResi.replace(/[^a-zA-Z0-9 ]/g, "")} TYPE OF RESIDENCE  ${caseData[i].typeOfResi.replace(/[^a-zA-Z0-9 ]/g, "")}${caseData[i].typeOfResiRemarks ? caseData[i].typeOfResiRemarks : ""} AREA LOCALITY  ${caseData[i].areaLocality.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + `RESIDENCE OWNERSHIP   NA `
                            }
                            if (caseData[i].workingFrom) {
                                remarks = remarks + `NO OF YEAR STAY  ${caseData[i].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            }
                            else {
                                remarks = remarks + `NO OF YEAR STAY  NA `
                            }
                            if (caseData[i].noOfFMember) {
                                remarks = remarks + `FAMILY MEMBER ${caseData[i].noOfFMember} `
                            } else {
                                remarks = remarks + `FAMILY MEMBER NA `
                            }
                            if (caseData[i].noEarningMember) {
                                remarks = remarks + `EARNING MEMBER  ${caseData[i].noEarningMember} `
                            } else {
                                remarks = remarks + `EARNING MEMBER  NA `
                            }
                            if (caseData[i].maritalStatus) {
                                remarks = remarks + `MARITIAL STATUS  ${caseData[i].maritalStatus.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + `MARITIAL STATUS  NA `
                            }
                            if (caseData[i].isSpouseWorking == "YES") {
                                remarks = remarks + `SPOUSE WORKING DETAIL WORKING PLACE ${caseData[i].spouseWorkingPlace.replace(/[^a-zA-Z0-9 ]/g, "")}  WORKING SINCE ${caseData[i].spouseWorkingSince.replace(/[^a-zA-Z0-9 ]/g, "")}  SALARY ${caseData[i].spouseSalary}  `
                            } else {
                                remarks = remarks + `SPOUSE WORKING DETAIL  NA `
                            }

                            if (caseData[i].vehicle) {
                                remarks = remarks + `VEHICLE DETAIL  ${caseData[i].vehicle}  ${caseData[i].vehicleRemarks ? caseData[i].vehicleRemarks : ""}  `
                            } else {
                                remarks = remarks + `VEHICLE DETAIL  NA `
                            }
                            if (caseData[i].houseArea) {
                                remarks = remarks + `OBSERVATION DETAIL HOUSE AREA  ${caseData[i].houseArea}  INTERIOR CONDITION  ${caseData[i].resiInterior.replace(/[^a-zA-Z0-9 ]/g, "")}  EXTERIOR CONDITION  ${caseData[i].resiExterior.replace(/[^a-zA-Z0-9 ]/g, "")}  HOUSE CONDITION  ${caseData[i].houseCondition.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + `OBSERVATION DETAIL NA `
                            }
                            if (caseData[i].remarks) {
                                remarks = remarks + `AGRI DETAIL ${caseData[i].remarks} `
                            }
                            else {
                                remarks = remarks + `AGRI DETAIL NA `
                            }
                            if (caseData[i].neighbourCheck1) {
                                remarks = remarks + `NEIGHBOUR CHECK  NAME1 ${caseData[i].neighbourCheck1} ${caseData[i].neighbourCheck1Remarks}  NAME2 ${caseData[i].neighbourCheck2} ${caseData[i].neighbourCheck2Remarks} `
                            } else { remarks = remarks + `NEIGHBOUR CHECK  NA ` }
                            if (caseData[i].distance) {
                                remarks = remarks + `DISTANCE FROM BRANCH  ${caseData[i].distance} `
                            } else {
                                remarks + remarks + `DISTANCE FROM BRANCH   NA `
                            }
                            if (caseData[i].caseStatus) {
                                remarks = remarks + `STATUS  ${caseData[i].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].caseStatusRemarks ? caseData[i].caseStatusRemarks : ""} `
                            } else {
                                remarks = remarks + `STATUS  NA `
                            }
                            if (caseData[i].lat) {
                                remarks = remarks + `LAT LON  ${caseData[i].lat} ${caseData[i].long} `
                            } else {
                                remarks = remarks + `LAT LON  NA `
                            }
                        }
                        row.getCell(47).value = remarks ? remarks : ""
                        let hoursDiff: any = ""
                        let submittedDate: any = ""
                        let excelDateTime: any = ""
                        if (caseData[0].date && caseData[0].time) {
                            if (caseData[i].supervisor?.submittedDate) {
                                submittedDate = moment(caseData[i].supervisor.submittedDate).utc().format()
                            }
                            if (caseData[i].manager?.submittedDate) {
                                submittedDate = moment(caseData[i].manager.submittedDate).utc().format()
                            }
                            if (caseData[i].seniorSupervisor?.submittedDate) {
                                submittedDate = moment(caseData[i].seniorSupervisor.submittedDate).utc().format()
                            }
                            if (caseData[i].admin?.submittedDate) {
                                submittedDate = moment(caseData[i].admin.submittedDate).utc().format()
                            }

                            excelDateTime = caseData[i].date + " " + caseData[i].time
                            excelDateTime = moment(excelDateTime, "DD-MM-YYYY HH:mm").utc().format()
                            let assignedTime = moment.duration(moment(excelDateTime).utc().format("HH:mm")).asMinutes()
                            let submittedTime = moment.duration(moment(submittedDate).utc().format("HH:mm")).asMinutes()

                            if ((assignedTime >= 570 && assignedTime <= 1110) && (submittedTime >= 570 && submittedTime <= 1110)) {
                                let checkDateIsSame = moment(moment(excelDateTime).utc().format("YYYY-MM-DD")).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(excelDateTime).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60

                                } else {
                                    let daysDiff = moment(moment(submittedDate).utc().format("YYYY-MM-DD")).diff(moment(excelDateTime).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(excelDateTime).utc(), 'minute')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)

                                }
                            }
                            if ((assignedTime < 570 || assignedTime > 1110) && (submittedTime >= 570 && submittedTime <= 1110)) {
                                let newDate1: any = ""
                                if (assignedTime > 1110 && assignedTime < 1440) {
                                    newDate1 = moment(moment(excelDateTime).format("YYYY-MM-DD")).utc().add(1, 'days');
                                    newDate1 = moment(moment(newDate1).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                } else {
                                    newDate1 = moment(moment(excelDateTime).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                let checkDateIsSame = moment(moment(newDate1).utc().format("YYYY-MM-DD")).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(newDate1).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60

                                } else {
                                    let daysDiff = moment(moment(submittedDate).utc().format("YYYY-MM-DD")).diff(moment(newDate1).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(newDate1).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)

                                }

                            }
                            if ((assignedTime >= 570 && assignedTime <= 1110) && (submittedTime < 570 || submittedTime > 1110)) {
                                let newDate2: any = ""
                                if (submittedTime > 1110 && submittedTime < 1440) {
                                    newDate2 = moment(moment(submittedDate).format("YYYY-MM-DD")).utc().add(1, 'days');
                                    newDate2 = moment(newDate2).set("hour", 9).set("minute", 30).set("second", 0)

                                } else {
                                    newDate2 = moment(moment(submittedDate).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                let checkDateIsSame = moment(moment(excelDateTime).utc().format("YYYY-MM-DD")).isSame(moment(newDate2).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(newDate2).diff(moment(excelDateTime).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60

                                } else {
                                    let daysDiff = moment(moment(newDate2).utc().format("YYYY-MM-DD")).diff(moment(excelDateTime).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(newDate2).diff(moment(excelDateTime).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)

                                }

                            }
                            if ((assignedTime < 570 || assignedTime > 1110) && (submittedTime < 570 || submittedTime > 1110)) {
                                let newDate1: any = ""
                                let newDate2: any = ""
                                if (assignedTime > 1110 && assignedTime < 1440) {
                                    newDate1 = moment(moment(excelDateTime)).utc().add(1, 'days');
                                    newDate1 = moment(moment(newDate1).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                } else {
                                    newDate1 = moment(moment(excelDateTime).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                if (submittedTime > 1110 && submittedTime < 1440) {
                                    newDate2 = moment(moment(submittedDate)).utc().add(1, 'days');
                                    newDate2 = moment(moment(newDate2).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                } else {
                                    newDate2 = moment(submittedDate).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                let checkDateIsSame = moment(moment(newDate1).utc().format("YYYY-MM-DD")).isSame(moment(newDate2).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(newDate2).diff(moment(newDate1), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                } else {
                                    let daysDiff = moment(moment(newDate2).utc().format("YYYY-MM-DD")).diff(moment(newDate1).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(newDate2).diff(moment(newDate1), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)
                                }
                            }
                        }
                        row.getCell(48).value = hoursDiff;
                    }

                    if (role === 'manager') {
                        row.getCell(19).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.name ? caseData[i].seniorSupervisor.name : "" : ""
                        row.getCell(20).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.assignedDate ? moment(caseData[i].seniorSupervisor.assignedDate).utc().format("YYYY-MM-DD") : "" : "";
                        row.getCell(21).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.assignedDate ? moment(caseData[i].seniorSupervisor.assignedDate).utc().format("HH:mm:ss") : "" : "";
                        row.getCell(22).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.submittedDate ? moment(caseData[i].seniorSupervisor.submittedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(23).value = caseData[i].seniorSupervisor ? caseData[i].seniorSupervisor.submittedDate ? moment(caseData[i].seniorSupervisor.submittedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(24).value = caseData[i].supervisor ? caseData[i].supervisor.name ? caseData[i].supervisor.name : "" : ""
                        row.getCell(25).value = caseData[i].supervisor ? caseData[i].supervisor.assignedDate ? moment(caseData[i].supervisor.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(26).value = caseData[i].supervisor ? caseData[i].supervisor.assignedDate ? moment(caseData[i].supervisor.assignedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(27).value = caseData[i].supervisor ? caseData[i].supervisor.submittedDate ? moment(caseData[i].supervisor.submittedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(28).value = caseData[i].supervisor ? caseData[i].supervisor.submittedDate ? moment(caseData[i].supervisor.submittedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(29).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.name ? caseData[i].fieldExecutive.name : "" : ""
                        row.getCell(30).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(31).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(32).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(33).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(34).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.submittedDate ? moment(caseData[i].fieldExecutive.submittedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(35).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.submittedDate ? moment(caseData[i].fieldExecutive.submittedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(36).value = caseData[i].distance ? caseData[i].distance : ""
                        row.getCell(37).value = caseData[i].caseStatus ? caseData[i].caseStatus : ""
                        row.getCell(38).value = caseData[i].caseStatusRemarks ? caseData[i].caseStatusRemarks : ""
                        let remarks = "";
                        if (caseData[i].addressType == "BV") {
                            remarks = `GIVEN ADDRESS CONFIRM  ${caseData[i].addressConfirm} `
                            if (caseData[i].applicantAge) {
                                remarks = `${remarks}` + ` APPLICANT AGE  ${caseData[i].applicantAge} `
                            } else {
                                remarks = `${remarks}` + ` APPLICANT AGE  NA `
                            }
                            if (caseData[i].contactedPersonName) {
                                remarks = `${remarks}` + ` PERSON MET ${caseData[i].contactedPersonName}  ${caseData[i].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "")}  ${caseData[i].contactedPersonDesignationRemarks ? caseData[i].contactedPersonDesignationRemarks : ""} `
                            } else {
                                remarks = `${remarks}` + ` PERSON MET NA `
                            }
                            if (caseData[i].natureOfBusiness) {
                                remarks = `${remarks}` + ` NATURE OF WORK  ${caseData[i].natureOfBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].natureOfBusinessRemarks} ${caseData[i].nOfBR2} `
                            } else {
                                remarks = `${remarks}` + ` NATURE OF WORK  NA `
                            }
                            if (caseData[i].workingFrom) {
                                remarks = remarks + ` WORKING YEAR  ${caseData[i].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + ` WORKING YEAR  NA `
                            }
                            if (caseData[i].applicantDesignation) {
                                remarks = remarks + ` DESIGNATION  ${caseData[i].applicantDesignation.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].applicantDesignationRemarks ? caseData[i].applicantDesignationRemarks : ""} `
                            } else {
                                remarks = remarks + ` DESIGNATION  NA `
                            }
                            if (caseData[i].applicantOccupation == "SALARIED") {
                                remarks = remarks + ` SALARY  ${caseData[i].totalIncome ? caseData[i].totalIncome : "NA"} `
                            }
                            else {
                                remarks = remarks + ` INCOME  ${caseData[i].totalIncome ? caseData[i].totalIncome : "NA"} `
                            }
                            remarks = remarks + ` BUSINESS BOARD SEEN  ${caseData[i].businessBoard ? caseData[i].businessBoard.replace(/[^a-zA-Z0-9 ]/g, "") : "NA"}`
                            if (caseData[i].businessBoardNameConfirmation) {
                                remarks = remarks + ` SAME NAME  ${caseData[i].businessBoardNameConfirmation}${caseData[i].businessBoardNameRemarks ? caseData[i].businessBoardNameRemarks : ""} `
                            } else {
                                remarks = remarks + `SAME NAME  NA `
                            }
                            if (caseData[i].businessActivitySeen) {
                                remarks = remarks + `WORKING ACTIVITY SEEN  ${caseData[i].businessActivitySeen} ${caseData[i].businessActivity} `
                            }
                            else {
                                remarks = remarks + `WORKING ACTIVITY SEEN  NA `
                            }
                            if (caseData[i].stockSeen) {
                                remarks = remarks + `STOCK SEEN ${caseData[i].stockSeen}  ${caseData[i].stock} `
                            }
                            else {
                                remarks = remarks + `STOCK SEEN  NA `
                            }
                            if (caseData[i].noOfEmployees) {
                                remarks = remarks + `NO OF EMPLOYEES  ${caseData[i].noOfEmployees} `
                            }
                            else {
                                remarks = remarks + `NO OF EMPLOYEES  NA `
                            }
                            if (caseData[i].premisesBusiness) {
                                remarks = remarks + `OFFICE PREMISES  ${caseData[i].premisesBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].premisesBusinessRemarks ? caseData[i].premisesBusinessRemarks : ""} `
                            }
                            else {
                                remarks = remarks + `OFFICE PREMISES   NA `
                            }
                            remarks = remarks + `ADDITIONAL REMARK ${caseData[i].remarks ? caseData[i].remarks : "NA"} `;
                            if (caseData[i].neighbourCheck1) {
                                remarks = remarks + `NEIGHBOUR CHECK NAME1 ${caseData[i].neighbourCheck1} ${caseData[i].neighbourCheck1Remarks} NAME2 ${caseData[i].neighbourCheck2} ${caseData[i].neighbourCheck2Remarks} `
                            }
                            else {
                                remarks = remarks + `NEIGHBOUR CHECK  NA `
                            }
                            if (caseData[i].distance) {
                                remarks = remarks + `DISTANCE FROM BRANCH  ${caseData[i].distance} `
                            }
                            else {
                                remarks = remarks + `DISTANCE FROM  BRANCH  NA `
                            }
                            if (caseData[i].caseStatus) {
                                remarks = remarks + `STATUS  ${caseData[i].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].caseStatusRemarks ? caseData[i].caseStatusRemarks : ""} `
                            }
                            else {
                                remarks = remarks + `STATUS  NA `
                            }
                            if (caseData[i].lat) { remarks = remarks + `LAT LON ${caseData[i].lat} ${caseData[i].long} ` }
                            else {
                                remarks = remarks + `LAT LON  NA `
                            }
                        } else {
                            remarks = `GIVEN ADDRESS CONFIRM  ${caseData[i].addressConfirm} `
                            if (caseData[i].applicantAge) {
                                remarks = `${remarks}` + ` APPLICANT AGE  ${caseData[i].applicantAge} `
                            } else {
                                remarks = `${remarks}` + ` APPLICANT AGE  NA `
                            }
                            if (caseData[i].contactedPersonName) {
                                remarks = `${remarks}` + `PERSON MET  ${caseData[i].contactedPersonName} ${caseData[i].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].contactedPersonDesignationRemarks ? caseData[i].contactedPersonDesignationRemarks : ""} `
                            } else {
                                remarks = `${remarks}` + `PERSON MET  NA `
                            }
                            if (caseData[i].premisesResidence) {
                                remarks = remarks + `RESIDENCE OWNERSHIP  PREMISES  ${caseData[i].premisesResidence.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].premisesResidenceRemarks ? caseData[i].premisesResidenceRemarks : ""} LOCATION OF RESIDENCE  ${caseData[i].locationOfResi.replace(/[^a-zA-Z0-9 ]/g, "")} TYPE OF RESIDENCE  ${caseData[i].typeOfResi.replace(/[^a-zA-Z0-9 ]/g, "")}${caseData[i].typeOfResiRemarks ? caseData[i].typeOfResiRemarks : ""} AREA LOCALITY  ${caseData[i].areaLocality.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + `RESIDENCE OWNERSHIP   NA `
                            }
                            if (caseData[i].workingFrom) {
                                remarks = remarks + `NO OF YEAR STAY  ${caseData[i].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            }
                            else {
                                remarks = remarks + `NO OF YEAR STAY  NA `
                            }
                            if (caseData[i].noOfFMember) {
                                remarks = remarks + `FAMILY MEMBER ${caseData[i].noOfFMember} `
                            } else {
                                remarks = remarks + `FAMILY MEMBER NA `
                            }
                            if (caseData[i].noEarningMember) {
                                remarks = remarks + `EARNING MEMBER  ${caseData[i].noEarningMember} `
                            } else {
                                remarks = remarks + `EARNING MEMBER  NA `
                            }
                            if (caseData[i].maritalStatus) {
                                remarks = remarks + `MARITIAL STATUS  ${caseData[i].maritalStatus.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + `MARITIAL STATUS  NA `
                            }
                            if (caseData[i].isSpouseWorking == "YES") {
                                remarks = remarks + `SPOUSE WORKING DETAIL WORKING PLACE ${caseData[i].spouseWorkingPlace.replace(/[^a-zA-Z0-9 ]/g, "")}  WORKING SINCE ${caseData[i].spouseWorkingSince.replace(/[^a-zA-Z0-9 ]/g, "")}  SALARY ${caseData[i].spouseSalary}  `
                            } else {
                                remarks = remarks + `SPOUSE WORKING DETAIL  NA `
                            }

                            if (caseData[i].vehicle) {
                                remarks = remarks + `VEHICLE DETAIL  ${caseData[i].vehicle}  ${caseData[i].vehicleRemarks ? caseData[i].vehicleRemarks : ""}  `
                            } else {
                                remarks = remarks + `VEHICLE DETAIL  NA `
                            }
                            if (caseData[i].houseArea) {
                                remarks = remarks + `OBSERVATION DETAIL HOUSE AREA  ${caseData[i].houseArea}  INTERIOR CONDITION  ${caseData[i].resiInterior.replace(/[^a-zA-Z0-9 ]/g, "")}  EXTERIOR CONDITION  ${caseData[i].resiExterior.replace(/[^a-zA-Z0-9 ]/g, "")}  HOUSE CONDITION  ${caseData[i].houseCondition.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + `OBSERVATION DETAIL NA `
                            }
                            if (caseData[i].remarks) {
                                remarks = remarks + `AGRI DETAIL ${caseData[i].remarks} `
                            }
                            else {
                                remarks = remarks + `AGRI DETAIL NA `
                            }
                            if (caseData[i].neighbourCheck1) {
                                remarks = remarks + `NEIGHBOUR CHECK  NAME1 ${caseData[i].neighbourCheck1} ${caseData[i].neighbourCheck1Remarks}  NAME2 ${caseData[i].neighbourCheck2} ${caseData[i].neighbourCheck2Remarks} `
                            } else { remarks = remarks + `NEIGHBOUR CHECK  NA ` }
                            if (caseData[i].distance) {
                                remarks = remarks + `DISTANCE FROM BRANCH  ${caseData[i].distance} `
                            } else {
                                remarks + remarks + `DISTANCE FROM BRANCH   NA `
                            }
                            if (caseData[i].caseStatus) {
                                remarks = remarks + `STATUS  ${caseData[i].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].caseStatusRemarks ? caseData[i].caseStatusRemarks : ""} `
                            } else {
                                remarks = remarks + `STATUS  NA `
                            }
                            if (caseData[i].lat) {
                                remarks = remarks + `LAT LON  ${caseData[i].lat} ${caseData[i].long} `
                            } else {
                                remarks = remarks + `LAT LON  NA `
                            }
                        }
                        row.getCell(39).value = remarks ? remarks : ""
                        let hoursDiff: any = ""
                        let submittedDate: any = ""
                        let excelDateTime: any = ""
                        if (caseData[0].date && caseData[0].time) {
                            if (caseData[i].supervisor?.submittedDate) {
                                submittedDate = moment(caseData[i].supervisor.submittedDate).utc().format()
                            }
                            if (caseData[i].manager?.submittedDate) {
                                submittedDate = moment(caseData[i].manager.submittedDate).utc().format()
                            }
                            if (caseData[i].seniorSupervisor?.submittedDate) {
                                submittedDate = moment(caseData[i].seniorSupervisor.submittedDate).utc().format()
                            }
                            if (caseData[i].admin?.submittedDate) {
                                submittedDate = moment(caseData[i].admin.submittedDate).utc().format()
                            }

                            excelDateTime = caseData[i].date + " " + caseData[i].time
                            excelDateTime = moment(excelDateTime, "DD-MM-YYYY HH:mm").utc().format()
                            let assignedTime = moment.duration(moment(excelDateTime).utc().format("HH:mm")).asMinutes()
                            let submittedTime = moment.duration(moment(submittedDate).utc().format("HH:mm")).asMinutes()

                            if ((assignedTime >= 570 && assignedTime <= 1110) && (submittedTime >= 570 && submittedTime <= 1110)) {
                                let checkDateIsSame = moment(moment(excelDateTime).utc().format("YYYY-MM-DD")).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(excelDateTime).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60

                                } else {
                                    let daysDiff = moment(moment(submittedDate).utc().format("YYYY-MM-DD")).diff(moment(excelDateTime).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(excelDateTime).utc(), 'minute')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)

                                }
                            }
                            if ((assignedTime < 570 || assignedTime > 1110) && (submittedTime >= 570 && submittedTime <= 1110)) {
                                let newDate1: any = ""
                                if (assignedTime > 1110 && assignedTime < 1440) {
                                    newDate1 = moment(moment(excelDateTime).format("YYYY-MM-DD")).utc().add(1, 'days');
                                    newDate1 = moment(moment(newDate1).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                } else {
                                    newDate1 = moment(moment(excelDateTime).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                let checkDateIsSame = moment(moment(newDate1).utc().format("YYYY-MM-DD")).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(newDate1).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60

                                } else {
                                    let daysDiff = moment(moment(submittedDate).utc().format("YYYY-MM-DD")).diff(moment(newDate1).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(newDate1).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)

                                }

                            }
                            if ((assignedTime >= 570 && assignedTime <= 1110) && (submittedTime < 570 || submittedTime > 1110)) {
                                let newDate2: any = ""
                                if (submittedTime > 1110 && submittedTime < 1440) {
                                    newDate2 = moment(moment(submittedDate).format("YYYY-MM-DD")).utc().add(1, 'days');
                                    newDate2 = moment(newDate2).set("hour", 9).set("minute", 30).set("second", 0)

                                } else {
                                    newDate2 = moment(moment(submittedDate).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                let checkDateIsSame = moment(moment(excelDateTime).utc().format("YYYY-MM-DD")).isSame(moment(newDate2).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(newDate2).diff(moment(excelDateTime).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60

                                } else {
                                    let daysDiff = moment(moment(newDate2).utc().format("YYYY-MM-DD")).diff(moment(excelDateTime).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(newDate2).diff(moment(excelDateTime).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)

                                }

                            }
                            if ((assignedTime < 570 || assignedTime > 1110) && (submittedTime < 570 || submittedTime > 1110)) {
                                let newDate1: any = ""
                                let newDate2: any = ""
                                if (assignedTime > 1110 && assignedTime < 1440) {
                                    newDate1 = moment(moment(excelDateTime)).utc().add(1, 'days');
                                    newDate1 = moment(moment(newDate1).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                } else {
                                    newDate1 = moment(moment(excelDateTime).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                if (submittedTime > 1110 && submittedTime < 1440) {
                                    newDate2 = moment(moment(submittedDate)).utc().add(1, 'days');
                                    newDate2 = moment(moment(newDate2).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                } else {
                                    newDate2 = moment(submittedDate).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                let checkDateIsSame = moment(moment(newDate1).utc().format("YYYY-MM-DD")).isSame(moment(newDate2).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(newDate2).diff(moment(newDate1), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                } else {
                                    let daysDiff = moment(moment(newDate2).utc().format("YYYY-MM-DD")).diff(moment(newDate1).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(newDate2).diff(moment(newDate1), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)
                                }
                            }
                        }
                        row.getCell(40).value = hoursDiff;
                    }

                    if (role === 'senior-supervisor') {
                        row.getCell(19).value = caseData[i].supervisor ? caseData[i].supervisor.name ? caseData[i].supervisor.name : "" : ""
                        row.getCell(20).value = caseData[i].supervisor ? caseData[i].supervisor.assignedDate ? moment(caseData[i].supervisor.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(21).value = caseData[i].supervisor ? caseData[i].supervisor.assignedDate ? moment(caseData[i].supervisor.assignedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(22).value = caseData[i].supervisor ? caseData[i].supervisor.submittedDate ? moment(caseData[i].supervisor.submittedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(23).value = caseData[i].supervisor ? caseData[i].supervisor.submittedDate ? moment(caseData[i].supervisor.submittedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(24).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.name ? caseData[i].fieldExecutive.name : "" : ""
                        row.getCell(25).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(26).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(27).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(28).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(29).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.submittedDate ? moment(caseData[i].fieldExecutive.submittedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(30).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.submittedDate ? moment(caseData[i].fieldExecutive.submittedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(31).value = caseData[i].distance ? caseData[i].distance : ""
                        row.getCell(32).value = caseData[i].caseStatus ? caseData[i].caseStatus : ""
                        row.getCell(33).value = caseData[i].caseStatusRemarks ? caseData[i].caseStatusRemarks : ""
                        let remarks = "";
                        if (caseData[i].addressType == "BV") {
                            remarks = `GIVEN ADDRESS CONFIRM  ${caseData[i].addressConfirm} `
                            if (caseData[i].applicantAge) {
                                remarks = `${remarks}` + ` APPLICANT AGE  ${caseData[i].applicantAge} `
                            } else {
                                remarks = `${remarks}` + ` APPLICANT AGE  NA `
                            }
                            if (caseData[i].contactedPersonName) {
                                remarks = `${remarks}` + ` PERSON MET ${caseData[i].contactedPersonName}  ${caseData[i].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "")}  ${caseData[i].contactedPersonDesignationRemarks ? caseData[i].contactedPersonDesignationRemarks : ""} `
                            } else {
                                remarks = `${remarks}` + ` PERSON MET NA `
                            }
                            if (caseData[i].natureOfBusiness) {
                                remarks = `${remarks}` + ` NATURE OF WORK  ${caseData[i].natureOfBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].natureOfBusinessRemarks} ${caseData[i].nOfBR2} `
                            } else {
                                remarks = `${remarks}` + ` NATURE OF WORK  NA `
                            }
                            if (caseData[i].workingFrom) {
                                remarks = remarks + ` WORKING YEAR  ${caseData[i].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + ` WORKING YEAR  NA `
                            }
                            if (caseData[i].applicantDesignation) {
                                remarks = remarks + ` DESIGNATION  ${caseData[i].applicantDesignation.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].applicantDesignationRemarks ? caseData[i].applicantDesignationRemarks : ""} `
                            } else {
                                remarks = remarks + ` DESIGNATION  NA `
                            }
                            if (caseData[i].applicantOccupation == "SALARIED") {
                                remarks = remarks + ` SALARY  ${caseData[i].totalIncome ? caseData[i].totalIncome : "NA"} `
                            }
                            else {
                                remarks = remarks + ` INCOME  ${caseData[i].totalIncome ? caseData[i].totalIncome : "NA"} `
                            }
                            remarks = remarks + ` BUSINESS BOARD SEEN  ${caseData[i].businessBoard ? caseData[i].businessBoard.replace(/[^a-zA-Z0-9 ]/g, "") : "NA"}`
                            if (caseData[i].businessBoardNameConfirmation) {
                                remarks = remarks + ` SAME NAME  ${caseData[i].businessBoardNameConfirmation}${caseData[i].businessBoardNameRemarks ? caseData[i].businessBoardNameRemarks : ""} `
                            } else {
                                remarks = remarks + `SAME NAME  NA `
                            }
                            if (caseData[i].businessActivitySeen) {
                                remarks = remarks + `WORKING ACTIVITY SEEN  ${caseData[i].businessActivitySeen} ${caseData[i].businessActivity} `
                            }
                            else {
                                remarks = remarks + `WORKING ACTIVITY SEEN  NA `
                            }
                            if (caseData[i].stockSeen) {
                                remarks = remarks + `STOCK SEEN ${caseData[i].stockSeen}  ${caseData[i].stock} `
                            }
                            else {
                                remarks = remarks + `STOCK SEEN  NA `
                            }
                            if (caseData[i].noOfEmployees) {
                                remarks = remarks + `NO OF EMPLOYEES  ${caseData[i].noOfEmployees} `
                            }
                            else {
                                remarks = remarks + `NO OF EMPLOYEES  NA `
                            }
                            if (caseData[i].premisesBusiness) {
                                remarks = remarks + `OFFICE PREMISES  ${caseData[i].premisesBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].premisesBusinessRemarks ? caseData[i].premisesBusinessRemarks : ""} `
                            }
                            else {
                                remarks = remarks + `OFFICE PREMISES   NA `
                            }
                            remarks = remarks + `ADDITIONAL REMARK ${caseData[i].remarks ? caseData[i].remarks : "NA"} `;
                            if (caseData[i].neighbourCheck1) {
                                remarks = remarks + `NEIGHBOUR CHECK NAME1 ${caseData[i].neighbourCheck1} ${caseData[i].neighbourCheck1Remarks} NAME2 ${caseData[i].neighbourCheck2} ${caseData[i].neighbourCheck2Remarks} `
                            }
                            else {
                                remarks = remarks + `NEIGHBOUR CHECK  NA `
                            }
                            if (caseData[i].distance) {
                                remarks = remarks + `DISTANCE FROM BRANCH  ${caseData[i].distance} `
                            }
                            else {
                                remarks = remarks + `DISTANCE FROM  BRANCH  NA `
                            }
                            if (caseData[i].caseStatus) {
                                remarks = remarks + `STATUS  ${caseData[i].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].caseStatusRemarks ? caseData[i].caseStatusRemarks : ""} `
                            }
                            else {
                                remarks = remarks + `STATUS  NA `
                            }
                            if (caseData[i].lat) { remarks = remarks + `LAT LON ${caseData[i].lat} ${caseData[i].long} ` }
                            else {
                                remarks = remarks + `LAT LON  NA `
                            }
                        } else {
                            remarks = `GIVEN ADDRESS CONFIRM  ${caseData[i].addressConfirm} `
                            if (caseData[i].applicantAge) {
                                remarks = `${remarks}` + ` APPLICANT AGE  ${caseData[i].applicantAge} `
                            } else {
                                remarks = `${remarks}` + ` APPLICANT AGE  NA `
                            }
                            if (caseData[i].contactedPersonName) {
                                remarks = `${remarks}` + `PERSON MET  ${caseData[i].contactedPersonName} ${caseData[i].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].contactedPersonDesignationRemarks ? caseData[i].contactedPersonDesignationRemarks : ""} `
                            } else {
                                remarks = `${remarks}` + `PERSON MET  NA `
                            }
                            if (caseData[i].premisesResidence) {
                                remarks = remarks + `RESIDENCE OWNERSHIP  PREMISES  ${caseData[i].premisesResidence.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].premisesResidenceRemarks ? caseData[i].premisesResidenceRemarks : ""} LOCATION OF RESIDENCE  ${caseData[i].locationOfResi.replace(/[^a-zA-Z0-9 ]/g, "")} TYPE OF RESIDENCE  ${caseData[i].typeOfResi.replace(/[^a-zA-Z0-9 ]/g, "")}${caseData[i].typeOfResiRemarks ? caseData[i].typeOfResiRemarks : ""} AREA LOCALITY  ${caseData[i].areaLocality.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + `RESIDENCE OWNERSHIP   NA `
                            }
                            if (caseData[i].workingFrom) {
                                remarks = remarks + `NO OF YEAR STAY  ${caseData[i].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            }
                            else {
                                remarks = remarks + `NO OF YEAR STAY  NA `
                            }
                            if (caseData[i].noOfFMember) {
                                remarks = remarks + `FAMILY MEMBER ${caseData[i].noOfFMember} `
                            } else {
                                remarks = remarks + `FAMILY MEMBER NA `
                            }
                            if (caseData[i].noEarningMember) {
                                remarks = remarks + `EARNING MEMBER  ${caseData[i].noEarningMember} `
                            } else {
                                remarks = remarks + `EARNING MEMBER  NA `
                            }
                            if (caseData[i].maritalStatus) {
                                remarks = remarks + `MARITIAL STATUS  ${caseData[i].maritalStatus.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + `MARITIAL STATUS  NA `
                            }
                            if (caseData[i].isSpouseWorking == "YES") {
                                remarks = remarks + `SPOUSE WORKING DETAIL WORKING PLACE ${caseData[i].spouseWorkingPlace.replace(/[^a-zA-Z0-9 ]/g, "")}  WORKING SINCE ${caseData[i].spouseWorkingSince.replace(/[^a-zA-Z0-9 ]/g, "")}  SALARY ${caseData[i].spouseSalary}  `
                            } else {
                                remarks = remarks + `SPOUSE WORKING DETAIL  NA `
                            }

                            if (caseData[i].vehicle) {
                                remarks = remarks + `VEHICLE DETAIL  ${caseData[i].vehicle}  ${caseData[i].vehicleRemarks ? caseData[i].vehicleRemarks : ""}  `
                            } else {
                                remarks = remarks + `VEHICLE DETAIL  NA `
                            }
                            if (caseData[i].houseArea) {
                                remarks = remarks + `OBSERVATION DETAIL HOUSE AREA  ${caseData[i].houseArea}  INTERIOR CONDITION  ${caseData[i].resiInterior.replace(/[^a-zA-Z0-9 ]/g, "")}  EXTERIOR CONDITION  ${caseData[i].resiExterior.replace(/[^a-zA-Z0-9 ]/g, "")}  HOUSE CONDITION  ${caseData[i].houseCondition.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + `OBSERVATION DETAIL NA `
                            }
                            if (caseData[i].remarks) {
                                remarks = remarks + `AGRI DETAIL ${caseData[i].remarks} `
                            }
                            else {
                                remarks = remarks + `AGRI DETAIL NA `
                            }
                            if (caseData[i].neighbourCheck1) {
                                remarks = remarks + `NEIGHBOUR CHECK  NAME1 ${caseData[i].neighbourCheck1} ${caseData[i].neighbourCheck1Remarks}  NAME2 ${caseData[i].neighbourCheck2} ${caseData[i].neighbourCheck2Remarks} `
                            } else { remarks = remarks + `NEIGHBOUR CHECK  NA ` }
                            if (caseData[i].distance) {
                                remarks = remarks + `DISTANCE FROM BRANCH  ${caseData[i].distance} `
                            } else {
                                remarks + remarks + `DISTANCE FROM BRANCH   NA `
                            }
                            if (caseData[i].caseStatus) {
                                remarks = remarks + `STATUS  ${caseData[i].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].caseStatusRemarks ? caseData[i].caseStatusRemarks : ""} `
                            } else {
                                remarks = remarks + `STATUS  NA `
                            }
                            if (caseData[i].lat) {
                                remarks = remarks + `LAT LON  ${caseData[i].lat} ${caseData[i].long} `
                            } else {
                                remarks = remarks + `LAT LON  NA `
                            }
                        }
                        row.getCell(34).value = remarks ? remarks : ""
                        let hoursDiff: any = ""
                        let submittedDate: any = ""
                        let excelDateTime: any = ""
                        if (caseData[0].date && caseData[0].time) {
                            if (caseData[i].supervisor?.submittedDate) {
                                submittedDate = moment(caseData[i].supervisor.submittedDate).utc().format()
                            }
                            if (caseData[i].manager?.submittedDate) {
                                submittedDate = moment(caseData[i].manager.submittedDate).utc().format()
                            }
                            if (caseData[i].seniorSupervisor?.submittedDate) {
                                submittedDate = moment(caseData[i].seniorSupervisor.submittedDate).utc().format()
                            }
                            if (caseData[i].admin?.submittedDate) {
                                submittedDate = moment(caseData[i].admin.submittedDate).utc().format()
                            }

                            excelDateTime = caseData[i].date + " " + caseData[i].time
                            excelDateTime = moment(excelDateTime, "DD-MM-YYYY HH:mm").utc().format()
                            let assignedTime = moment.duration(moment(excelDateTime).utc().format("HH:mm")).asMinutes()
                            let submittedTime = moment.duration(moment(submittedDate).utc().format("HH:mm")).asMinutes()

                            if ((assignedTime >= 570 && assignedTime <= 1110) && (submittedTime >= 570 && submittedTime <= 1110)) {
                                let checkDateIsSame = moment(moment(excelDateTime).utc().format("YYYY-MM-DD")).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(excelDateTime).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60

                                } else {
                                    let daysDiff = moment(moment(submittedDate).utc().format("YYYY-MM-DD")).diff(moment(excelDateTime).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(excelDateTime).utc(), 'minute')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)

                                }
                            }
                            if ((assignedTime < 570 || assignedTime > 1110) && (submittedTime >= 570 && submittedTime <= 1110)) {
                                let newDate1: any = ""
                                if (assignedTime > 1110 && assignedTime < 1440) {
                                    newDate1 = moment(moment(excelDateTime).format("YYYY-MM-DD")).utc().add(1, 'days');
                                    newDate1 = moment(moment(newDate1).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                } else {
                                    newDate1 = moment(moment(excelDateTime).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                let checkDateIsSame = moment(moment(newDate1).utc().format("YYYY-MM-DD")).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(newDate1).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60

                                } else {
                                    let daysDiff = moment(moment(submittedDate).utc().format("YYYY-MM-DD")).diff(moment(newDate1).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(newDate1).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)

                                }

                            }
                            if ((assignedTime >= 570 && assignedTime <= 1110) && (submittedTime < 570 || submittedTime > 1110)) {
                                let newDate2: any = ""
                                if (submittedTime > 1110 && submittedTime < 1440) {
                                    newDate2 = moment(moment(submittedDate).format("YYYY-MM-DD")).utc().add(1, 'days');
                                    newDate2 = moment(newDate2).set("hour", 9).set("minute", 30).set("second", 0)

                                } else {
                                    newDate2 = moment(moment(submittedDate).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                let checkDateIsSame = moment(moment(excelDateTime).utc().format("YYYY-MM-DD")).isSame(moment(newDate2).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(newDate2).diff(moment(excelDateTime).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60

                                } else {
                                    let daysDiff = moment(moment(newDate2).utc().format("YYYY-MM-DD")).diff(moment(excelDateTime).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(newDate2).diff(moment(excelDateTime).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)

                                }

                            }
                            if ((assignedTime < 570 || assignedTime > 1110) && (submittedTime < 570 || submittedTime > 1110)) {
                                let newDate1: any = ""
                                let newDate2: any = ""
                                if (assignedTime > 1110 && assignedTime < 1440) {
                                    newDate1 = moment(moment(excelDateTime)).utc().add(1, 'days');
                                    newDate1 = moment(moment(newDate1).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                } else {
                                    newDate1 = moment(moment(excelDateTime).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                if (submittedTime > 1110 && submittedTime < 1440) {
                                    newDate2 = moment(moment(submittedDate)).utc().add(1, 'days');
                                    newDate2 = moment(moment(newDate2).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                } else {
                                    newDate2 = moment(submittedDate).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                let checkDateIsSame = moment(moment(newDate1).utc().format("YYYY-MM-DD")).isSame(moment(newDate2).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(newDate2).diff(moment(newDate1), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                } else {
                                    let daysDiff = moment(moment(newDate2).utc().format("YYYY-MM-DD")).diff(moment(newDate1).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(newDate2).diff(moment(newDate1), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)
                                }
                            }
                        }
                        row.getCell(35).value = hoursDiff;
                    }

                    if (role === 'supervisor') {
                        
                        row.getCell(19).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.name ? caseData[i].fieldExecutive.name : "" : ""
                        row.getCell(20).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(21).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.assignedDate ? moment(caseData[i].fieldExecutive.assignedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(22).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(23).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.acceptedDate ? moment(caseData[i].fieldExecutive.acceptedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(24).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.submittedDate ? moment(caseData[i].fieldExecutive.submittedDate).utc().format("YYYY-MM-DD") : "" : ""
                        row.getCell(25).value = caseData[i].fieldExecutive ? caseData[i].fieldExecutive.submittedDate ? moment(caseData[i].fieldExecutive.submittedDate).utc().format("HH:mm:ss") : "" : ""
                        row.getCell(26).value = caseData[i].distance ? caseData[i].distance : ""
                        row.getCell(27).value = caseData[i].caseStatus ? caseData[i].caseStatus : ""
                        row.getCell(28).value = caseData[i].caseStatusRemarks ? caseData[i].caseStatusRemarks : ""
                        let remarks = "";
                        if (caseData[i].addressType == "BV") {
                            remarks = `GIVEN ADDRESS CONFIRM  ${caseData[i].addressConfirm} `
                            if (caseData[i].applicantAge) {
                                remarks = `${remarks}` + ` APPLICANT AGE  ${caseData[i].applicantAge} `
                            } else {
                                remarks = `${remarks}` + ` APPLICANT AGE  NA `
                            }
                            if (caseData[i].contactedPersonName) {
                                remarks = `${remarks}` + ` PERSON MET ${caseData[i].contactedPersonName}  ${caseData[i].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "")}  ${caseData[i].contactedPersonDesignationRemarks ? caseData[i].contactedPersonDesignationRemarks : ""} `
                            } else {
                                remarks = `${remarks}` + ` PERSON MET NA `
                            }
                            if (caseData[i].natureOfBusiness) {
                                remarks = `${remarks}` + ` NATURE OF WORK  ${caseData[i].natureOfBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].natureOfBusinessRemarks} ${caseData[i].nOfBR2} `
                            } else {
                                remarks = `${remarks}` + ` NATURE OF WORK  NA `
                            }
                            if (caseData[i].workingFrom) {
                                remarks = remarks + ` WORKING YEAR  ${caseData[i].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + ` WORKING YEAR  NA `
                            }
                            if (caseData[i].applicantDesignation) {
                                remarks = remarks + ` DESIGNATION  ${caseData[i].applicantDesignation.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].applicantDesignationRemarks ? caseData[i].applicantDesignationRemarks : ""} `
                            } else {
                                remarks = remarks + ` DESIGNATION  NA `
                            }
                            if (caseData[i].applicantOccupation == "SALARIED") {
                                remarks = remarks + ` SALARY  ${caseData[i].totalIncome ? caseData[i].totalIncome : "NA"} `
                            }
                            else {
                                remarks = remarks + ` INCOME  ${caseData[i].totalIncome ? caseData[i].totalIncome : "NA"} `
                            }
                            remarks = remarks + ` BUSINESS BOARD SEEN  ${caseData[i].businessBoard ? caseData[i].businessBoard.replace(/[^a-zA-Z0-9 ]/g, "") : "NA"}`
                            if (caseData[i].businessBoardNameConfirmation) {
                                remarks = remarks + ` SAME NAME  ${caseData[i].businessBoardNameConfirmation}${caseData[i].businessBoardNameRemarks ? caseData[i].businessBoardNameRemarks : ""} `
                            } else {
                                remarks = remarks + `SAME NAME  NA `
                            }
                            if (caseData[i].businessActivitySeen) {
                                remarks = remarks + `WORKING ACTIVITY SEEN  ${caseData[i].businessActivitySeen} ${caseData[i].businessActivity} `
                            }
                            else {
                                remarks = remarks + `WORKING ACTIVITY SEEN  NA `
                            }
                            if (caseData[i].stockSeen) {
                                remarks = remarks + `STOCK SEEN ${caseData[i].stockSeen}  ${caseData[i].stock} `
                            }
                            else {
                                remarks = remarks + `STOCK SEEN  NA `
                            }
                            if (caseData[i].noOfEmployees) {
                                remarks = remarks + `NO OF EMPLOYEES  ${caseData[i].noOfEmployees} `
                            }
                            else {
                                remarks = remarks + `NO OF EMPLOYEES  NA `
                            }
                            if (caseData[i].premisesBusiness) {
                                remarks = remarks + `OFFICE PREMISES  ${caseData[i].premisesBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].premisesBusinessRemarks ? caseData[i].premisesBusinessRemarks : ""} `
                            }
                            else {
                                remarks = remarks + `OFFICE PREMISES   NA `
                            }
                            remarks = remarks + `ADDITIONAL REMARK ${caseData[i].remarks ? caseData[i].remarks : "NA"} `;
                            if (caseData[i].neighbourCheck1) {
                                remarks = remarks + `NEIGHBOUR CHECK NAME1 ${caseData[i].neighbourCheck1} ${caseData[i].neighbourCheck1Remarks} NAME2 ${caseData[i].neighbourCheck2} ${caseData[i].neighbourCheck2Remarks} `
                            }
                            else {
                                remarks = remarks + `NEIGHBOUR CHECK  NA `
                            }
                            if (caseData[i].distance) {
                                remarks = remarks + `DISTANCE FROM BRANCH  ${caseData[i].distance} `
                            }
                            else {
                                remarks = remarks + `DISTANCE FROM  BRANCH  NA `
                            }
                            if (caseData[i].caseStatus) {
                                remarks = remarks + `STATUS  ${caseData[i].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].caseStatusRemarks ? caseData[i].caseStatusRemarks : ""} `
                            }
                            else {
                                remarks = remarks + `STATUS  NA `
                            }
                            if (caseData[i].lat) { remarks = remarks + `LAT LON ${caseData[i].lat} ${caseData[i].long} ` }
                            else {
                                remarks = remarks + `LAT LON  NA `
                            }
                        } else {
                            remarks = `GIVEN ADDRESS CONFIRM  ${caseData[i].addressConfirm} `
                            if (caseData[i].applicantAge) {
                                remarks = `${remarks}` + ` APPLICANT AGE  ${caseData[i].applicantAge} `
                            } else {
                                remarks = `${remarks}` + ` APPLICANT AGE  NA `
                            }
                            if (caseData[i].contactedPersonName) {
                                remarks = `${remarks}` + `PERSON MET  ${caseData[i].contactedPersonName} ${caseData[i].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].contactedPersonDesignationRemarks ? caseData[i].contactedPersonDesignationRemarks : ""} `
                            } else {
                                remarks = `${remarks}` + `PERSON MET  NA `
                            }
                            if (caseData[i].premisesResidence) {
                                remarks = remarks + `RESIDENCE OWNERSHIP  PREMISES  ${caseData[i].premisesResidence.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].premisesResidenceRemarks ? caseData[i].premisesResidenceRemarks : ""} LOCATION OF RESIDENCE  ${caseData[i].locationOfResi.replace(/[^a-zA-Z0-9 ]/g, "")} TYPE OF RESIDENCE  ${caseData[i].typeOfResi.replace(/[^a-zA-Z0-9 ]/g, "")}${caseData[i].typeOfResiRemarks ? caseData[i].typeOfResiRemarks : ""} AREA LOCALITY  ${caseData[i].areaLocality.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + `RESIDENCE OWNERSHIP   NA `
                            }
                            if (caseData[i].workingFrom) {
                                remarks = remarks + `NO OF YEAR STAY  ${caseData[i].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            }
                            else {
                                remarks = remarks + `NO OF YEAR STAY  NA `
                            }
                            if (caseData[i].noOfFMember) {
                                remarks = remarks + `FAMILY MEMBER ${caseData[i].noOfFMember} `
                            } else {
                                remarks = remarks + `FAMILY MEMBER NA `
                            }
                            if (caseData[i].noEarningMember) {
                                remarks = remarks + `EARNING MEMBER  ${caseData[i].noEarningMember} `
                            } else {
                                remarks = remarks + `EARNING MEMBER  NA `
                            }
                            if (caseData[i].maritalStatus) {
                                remarks = remarks + `MARITIAL STATUS  ${caseData[i].maritalStatus.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + `MARITIAL STATUS  NA `
                            }
                            if (caseData[i].isSpouseWorking == "YES") {
                                remarks = remarks + `SPOUSE WORKING DETAIL WORKING PLACE ${caseData[i].spouseWorkingPlace.replace(/[^a-zA-Z0-9 ]/g, "")}  WORKING SINCE ${caseData[i].spouseWorkingSince.replace(/[^a-zA-Z0-9 ]/g, "")}  SALARY ${caseData[i].spouseSalary}  `
                            } else {
                                remarks = remarks + `SPOUSE WORKING DETAIL  NA `
                            }

                            if (caseData[i].vehicle) {
                                remarks = remarks + `VEHICLE DETAIL  ${caseData[i].vehicle}  ${caseData[i].vehicleRemarks ? caseData[i].vehicleRemarks : ""}  `
                            } else {
                                remarks = remarks + `VEHICLE DETAIL  NA `
                            }
                            if (caseData[i].houseArea) {
                                remarks = remarks + `OBSERVATION DETAIL HOUSE AREA  ${caseData[i].houseArea}  INTERIOR CONDITION  ${caseData[i].resiInterior.replace(/[^a-zA-Z0-9 ]/g, "")}  EXTERIOR CONDITION  ${caseData[i].resiExterior.replace(/[^a-zA-Z0-9 ]/g, "")}  HOUSE CONDITION  ${caseData[i].houseCondition.replace(/[^a-zA-Z0-9 ]/g, "")} `
                            } else {
                                remarks = remarks + `OBSERVATION DETAIL NA `
                            }
                            if (caseData[i].remarks) {
                                remarks = remarks + `AGRI DETAIL ${caseData[i].remarks} `
                            }
                            else {
                                remarks = remarks + `AGRI DETAIL NA `
                            }
                            if (caseData[i].neighbourCheck1) {
                                remarks = remarks + `NEIGHBOUR CHECK  NAME1 ${caseData[i].neighbourCheck1} ${caseData[i].neighbourCheck1Remarks}  NAME2 ${caseData[i].neighbourCheck2} ${caseData[i].neighbourCheck2Remarks} `
                            } else { remarks = remarks + `NEIGHBOUR CHECK  NA ` }
                            if (caseData[i].distance) {
                                remarks = remarks + `DISTANCE FROM BRANCH  ${caseData[i].distance} `
                            } else {
                                remarks + remarks + `DISTANCE FROM BRANCH   NA `
                            }
                            if (caseData[i].caseStatus) {
                                remarks = remarks + `STATUS  ${caseData[i].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[i].caseStatusRemarks ? caseData[i].caseStatusRemarks : ""} `
                            } else {
                                remarks = remarks + `STATUS  NA `
                            }
                            if (caseData[i].lat) {
                                remarks = remarks + `LAT LON  ${caseData[i].lat} ${caseData[i].long} `
                            } else {
                                remarks = remarks + `LAT LON  NA `
                            }
                        }
                        row.getCell(29).value = remarks ? remarks : ""
                        let hoursDiff: any = ""
                        let submittedDate: any = ""
                        let excelDateTime: any = ""
                        if (caseData[0].date && caseData[0].time) {
                            if (caseData[i].supervisor?.submittedDate) {
                                submittedDate = moment(caseData[i].supervisor.submittedDate).utc().format()
                            }
                            if (caseData[i].manager?.submittedDate) {
                                submittedDate = moment(caseData[i].manager.submittedDate).utc().format()
                            }
                            if (caseData[i].seniorSupervisor?.submittedDate) {
                                submittedDate = moment(caseData[i].seniorSupervisor.submittedDate).utc().format()
                            }
                            if (caseData[i].admin?.submittedDate) {
                                submittedDate = moment(caseData[i].admin.submittedDate).utc().format()
                            }

                            excelDateTime = caseData[i].date + " " + caseData[i].time
                            excelDateTime = moment(excelDateTime, "DD-MM-YYYY HH:mm").utc().format()
                            let assignedTime = moment.duration(moment(excelDateTime).utc().format("HH:mm")).asMinutes()
                            let submittedTime = moment.duration(moment(submittedDate).utc().format("HH:mm")).asMinutes()

                            if ((assignedTime >= 570 && assignedTime <= 1110) && (submittedTime >= 570 && submittedTime <= 1110)) {
                                let checkDateIsSame = moment(moment(excelDateTime).utc().format("YYYY-MM-DD")).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(excelDateTime).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60

                                } else {
                                    let daysDiff = moment(moment(submittedDate).utc().format("YYYY-MM-DD")).diff(moment(excelDateTime).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(excelDateTime).utc(), 'minute')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)

                                }
                            }
                            if ((assignedTime < 570 || assignedTime > 1110) && (submittedTime >= 570 && submittedTime <= 1110)) {
                                let newDate1: any = ""
                                if (assignedTime > 1110 && assignedTime < 1440) {
                                    newDate1 = moment(moment(excelDateTime).format("YYYY-MM-DD")).utc().add(1, 'days');
                                    newDate1 = moment(moment(newDate1).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                } else {
                                    newDate1 = moment(moment(excelDateTime).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                let checkDateIsSame = moment(moment(newDate1).utc().format("YYYY-MM-DD")).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(newDate1).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60

                                } else {
                                    let daysDiff = moment(moment(submittedDate).utc().format("YYYY-MM-DD")).diff(moment(newDate1).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(moment(submittedDate).utc()).diff(moment(newDate1).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)

                                }

                            }
                            if ((assignedTime >= 570 && assignedTime <= 1110) && (submittedTime < 570 || submittedTime > 1110)) {
                                let newDate2: any = ""
                                if (submittedTime > 1110 && submittedTime < 1440) {
                                    newDate2 = moment(moment(submittedDate).format("YYYY-MM-DD")).utc().add(1, 'days');
                                    newDate2 = moment(newDate2).set("hour", 9).set("minute", 30).set("second", 0)

                                } else {
                                    newDate2 = moment(moment(submittedDate).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                let checkDateIsSame = moment(moment(excelDateTime).utc().format("YYYY-MM-DD")).isSame(moment(newDate2).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(newDate2).diff(moment(excelDateTime).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60

                                } else {
                                    let daysDiff = moment(moment(newDate2).utc().format("YYYY-MM-DD")).diff(moment(excelDateTime).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(newDate2).diff(moment(excelDateTime).utc(), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)

                                }

                            }
                            if ((assignedTime < 570 || assignedTime > 1110) && (submittedTime < 570 || submittedTime > 1110)) {
                                let newDate1: any = ""
                                let newDate2: any = ""
                                if (assignedTime > 1110 && assignedTime < 1440) {
                                    newDate1 = moment(moment(excelDateTime)).utc().add(1, 'days');
                                    newDate1 = moment(moment(newDate1).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                } else {
                                    newDate1 = moment(moment(excelDateTime).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                if (submittedTime > 1110 && submittedTime < 1440) {
                                    newDate2 = moment(moment(submittedDate)).utc().add(1, 'days');
                                    newDate2 = moment(moment(newDate2).utc()).set("hour", 9).set("minute", 30).set("second", 0)
                                } else {
                                    newDate2 = moment(submittedDate).set("hour", 9).set("minute", 30).set("second", 0)
                                }
                                let checkDateIsSame = moment(moment(newDate1).utc().format("YYYY-MM-DD")).isSame(moment(newDate2).utc().format("YYYY-MM-DD"))
                                if (checkDateIsSame) {
                                    hoursDiff = moment(newDate2).diff(moment(newDate1), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                } else {
                                    let daysDiff = moment(moment(newDate2).utc().format("YYYY-MM-DD")).diff(moment(newDate1).utc().format("YYYY-MM-DD"), 'days')
                                    hoursDiff = moment(newDate2).diff(moment(newDate1), 'minutes')
                                    hoursDiff = hoursDiff / 60
                                    hoursDiff = hoursDiff - (15 * daysDiff)
                                }
                            }
                        }
                        row.getCell(30).value = hoursDiff;
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
export default createSuccessfullCaseExcel