import caseService from "@/services/commonServicesFile/case.service";
import invoiceService from "@/services/invoiceServices/invoice.service";

const invoiceExcel = async (data) => {
    const caseServices = new caseService();
    const invoiceServices = new invoiceService();
    try {
        const cond = { product: { $in: data.data.product }, bank: data.data.bank, area: { $in: data.data.area }, caseUploaded: { $gte: new Date(data.data.dateFrom), $lte: new Date(data.data.dateTo) }, stage: 'submited', status: 'closed' };
        const rateCond = { product: { $in: data.data.product }, bank: data.data.bank, area: { $in: data.data.area }, }
        let cases = await caseServices.getAllCase(cond);
        let rates = await invoiceServices.getAllRate(rateCond);
        let invoiceExcelData;
        switch (data.data.invoiceExcelFormat) {
            case "common_format":
            case "bandhan_format":
                for (let i = 0; i < cases.length; i++) {
                    const caseDistance = parseInt(cases[i].distance)
                    const point = cases[i].point;
                    const matchedRate = findMatchingRate(caseDistance, point, rates);
                    if (matchedRate) {
                        cases[i].rate = parseInt(matchedRate.rate);
                        cases[i].uniqueId = data.uniqueId;
                        delete cases[i]._id;
                    } else {
                        throw new Error("No matching rate found for case: " + 'area' + cases[i].area + 'product' + cases[i].product + 'bank' + cases[i].bank + 'km' + cases[i].distance);
                    }
                };
                invoiceExcelData = await invoiceServices.createInvoiceExcelData(cases);
                const update = {
                    status: invoiceExcelData.code === 401 ? 'failed' : 'success',
                    error: invoiceExcelData.code === 401 ? invoiceExcelData.message : undefined
                };
                await invoiceServices.updateInvoiceExcelDataStatus({ uniqueId: data.uniqueId }, update);
                break;
            case "csl_format":
                for (let i = 0; i < cases.length; i++) {
                    delete cases[i]._id;
                    const caseDistance = parseInt(cases[i].distance)
                    if (caseDistance > 30 && caseDistance <= 50) {
                        cases[i].conveyance = {
                            distance: caseDistance - 30,
                            cost: (caseDistance - 30) * data.data.conveyance
                        }
                    } else {
                        cases[i].conveyance = {
                            distance: 0,
                            cost: 0
                        }
                    }
                    const point = cases[i].point;
                    const matchedRate = findMatchingRate(caseDistance, point, rates);
                    if (matchedRate) {
                        cases[i].rate = parseInt(matchedRate.rate);
                        cases[i].uniqueId = data.uniqueId
                    } else {
                        throw new Error("No matching rate found for case: " + 'area' + cases[i].area + 'product' + cases[i].product + 'bank' + cases[i].bank + 'km' + cases[i].distance);
                    }
                };
                invoiceExcelData = await invoiceServices.createInvoiceExcelData(cases);
                if (invoiceExcelData.code === 401) {
                    const update = {
                        status: 'failed',
                        error: invoiceExcelData.message
                    }
                    await invoiceServices.updateInvoiceExcelDataStatus({ uniqueId: data.uniqueId }, update)
                } else {
                    const update = {
                        status: 'success',
                    }
                    await invoiceServices.updateInvoiceExcelDataStatus({ uniqueId: data.uniqueId }, update)
                }
                break;
            case "hdfc_format":

                for (let i = 0; i < cases.length; i++) {
                    let remarks;
                    if (typeof cases[i] === 'object') {
                        if (cases[i].addressType == "BV") {
                            remarks = `GIVEN ADDRESS CONFIRM  ${cases[i].addressConfirm} `;
                            if (cases[i].applicantAge) {
                                remarks = `${remarks}` + ` APPLICANT AGE  ${cases[i].applicantAge} `;
                            } else {
                                remarks = `${remarks}` + ` APPLICANT AGE  NA `;
                            }
                            if (cases[i].contactedPersonName) {
                                remarks = `${remarks}` + ` PERSON MET ${cases[i].contactedPersonName}  ${cases[i].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "")}  ${cases[i].contactedPersonDesignationRemarks ? cases[i].contactedPersonDesignationRemarks : ""} `;
                            } else {
                                remarks = `${remarks}` + ` PERSON MET NA `;
                            }
                            if (cases[i].natureOfBusiness) {
                                remarks = `${remarks}` + ` NATURE OF WORK  ${cases[i].natureOfBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[i].natureOfBusinessRemarks} ${cases[i].nOfBR2} `;
                            } else {
                                remarks = `${remarks}` + ` NATURE OF WORK  NA `;
                            }
                            if (cases[i].workingFrom) {
                                remarks = remarks + ` WORKING YEAR  ${cases[i].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `;
                            } else {
                                remarks = remarks + ` WORKING YEAR  NA `;
                            }
                            if (cases[i].applicantDesignation) {
                                remarks = remarks + ` DESIGNATION  ${cases[i].applicantDesignation.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[i].applicantDesignationRemarks ? cases[i].applicantDesignationRemarks : ""} `;
                            } else {
                                remarks = remarks + ` DESIGNATION  NA `;
                            }
                            if (cases[i].applicantOccupation == "SALARIED") {
                                remarks = remarks + ` SALARY  ${cases[i].totalIncome ? cases[i].totalIncome : "NA"} `;
                            } else {
                                remarks = remarks + ` INCOME  ${cases[i].totalIncome ? cases[i].totalIncome : "NA"} `;
                            }
                            remarks = remarks + ` BUSINESS BOARD SEEN  ${cases[i].businessBoard ? cases[i].businessBoard.replace(/[^a-zA-Z0-9 ]/g, "") : "NA"}`;
                            if (cases[i].businessBoardNameConfirmation) {
                                remarks = remarks + ` SAME NAME  ${cases[i].businessBoardNameConfirmation}${cases[i].businessBoardNameRemarks ? cases[i].businessBoardNameRemarks : ""} `;
                            } else {
                                remarks = remarks + `SAME NAME  NA `;
                            }
                            if (cases[i].businessActivitySeen) {
                                remarks = remarks + `WORKING ACTIVITY SEEN  ${cases[i].businessActivitySeen} ${cases[i].businessActivity} `;
                            } else {
                                remarks = remarks + `WORKING ACTIVITY SEEN  NA `;
                            }
                            if (cases[i].stockSeen) {
                                remarks = remarks + `STOCK SEEN ${cases[i].stockSeen}  ${cases[i].stock} `;
                            } else {
                                remarks = remarks + `STOCK SEEN  NA `;
                            }
                            if (cases[i].noOfEmployees) {
                                remarks = remarks + `NO OF EMPLOYEES  ${cases[i].noOfEmployees} `;
                            } else {
                                remarks = remarks + `NO OF EMPLOYEES  NA `;
                            }
                            if (cases[i].premisesBusiness) {
                                remarks = remarks + `OFFICE PREMISES  ${cases[i].premisesBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[i].premisesBusinessRemarks ? cases[i].premisesBusinessRemarks : ""} `;
                            } else {
                                remarks = remarks + `OFFICE PREMISES   NA `;
                            }
                            remarks =
                                remarks + `ADDITIONAL REMARK ${cases[i].remarks ? cases[i].remarks : "NA"} `;
                            if (cases[i].neighbourCheck1) {
                                remarks = remarks + `NEIGHBOUR CHECK NAME1 ${cases[i].neighbourCheck1} ${cases[i].neighbourCheck1Remarks} NAME2 ${cases[i].neighbourCheck2} ${cases[i].neighbourCheck2Remarks} `;
                            } else {
                                remarks = remarks + `NEIGHBOUR CHECK  NA `;
                            }
                            if (cases[i].distance) {
                                remarks = remarks + `DISTANCE FROM BRANCH  ${cases[i].distance} `;
                            } else {
                                remarks = remarks + `DISTANCE FROM  BRANCH  NA `;
                            }
                            if (cases[i].caseStatus) {
                                remarks = remarks + `STATUS  ${cases[i].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[i].caseStatusRemarks ? cases[i].caseStatusRemarks : ""} `;
                            } else {
                                remarks = remarks + `STATUS  NA `;
                            }
                            if (cases[i].lat) {
                                remarks = remarks + `LAT LON ${cases[i].lat} ${cases[i].long} `;
                            } else {
                                remarks = remarks + `LAT LON  NA `;
                            }
                        } else {
                            remarks = `GIVEN ADDRESS CONFIRM  ${cases[i].addressConfirm} `;
                            if (cases[i].applicantAge) {
                                remarks = `${remarks}` + ` APPLICANT AGE  ${cases[i].applicantAge} `;
                            } else {
                                remarks = `${remarks}` + ` APPLICANT AGE  NA `;
                            }
                            if (cases[i].contactedPersonName) {
                                remarks = `${remarks}` + `PERSON MET  ${cases[i].contactedPersonName} ${cases[i].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[i].contactedPersonDesignationRemarks ? cases[i].contactedPersonDesignationRemarks : ""} `;
                            } else {
                                remarks = `${remarks}` + `PERSON MET  NA `;
                            }
                            if (cases[i].premisesResidence) {
                                remarks = remarks + `RESIDENCE OWNERSHIP  PREMISES  ${cases[i].premisesResidence.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[i].premisesResidenceRemarks ? cases[i].premisesResidenceRemarks : ""} LOCATION OF RESIDENCE  ${cases[i].locationOfResi.replace(/[^a-zA-Z0-9 ]/g, "")} TYPE OF RESIDENCE  ${cases[i].typeOfResi.replace(/[^a-zA-Z0-9 ]/g, "")}${cases[i].typeOfResiRemarks ? cases[i].typeOfResiRemarks : ""} AREA LOCALITY  ${cases[i].areaLocality.replace(/[^a-zA-Z0-9 ]/g, "")} `;
                            } else {
                                remarks = remarks + `RESIDENCE OWNERSHIP   NA `;
                            }
                            if (cases[i].workingFrom) {
                                remarks = remarks + `NO OF YEAR STAY  ${cases[i].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `;
                            } else {
                                remarks = remarks + `NO OF YEAR STAY  NA `;
                            }
                            if (cases[i].noOfFMember) {
                                remarks =
                                    remarks + `FAMILY MEMBER ${cases[i].noOfFMember} `;
                            } else {
                                remarks = remarks + `FAMILY MEMBER NA `;
                            }
                            if (cases[i].noEarningMember) {
                                remarks = remarks + `EARNING MEMBER  ${cases[i].noEarningMember} `;
                            } else {
                                remarks = remarks + `EARNING MEMBER  NA `;
                            }
                            if (cases[i].maritalStatus) {
                                remarks = remarks + `MARITIAL STATUS  ${cases[i].maritalStatus.replace(/[^a-zA-Z0-9 ]/g, "")} `;
                            } else {
                                remarks = remarks + `MARITIAL STATUS  NA `;
                            }
                            if (cases[i].isSpouseWorking == "YES") {
                                remarks = remarks + `SPOUSE WORKING DETAIL WORKING PLACE ${cases[i].spouseWorkingPlace.replace(/[^a-zA-Z0-9 ]/g, "")}  WORKING SINCE ${cases[i].spouseWorkingSince.replace(/[^a-zA-Z0-9 ]/g, "")}  SALARY ${cases[i].spouseSalary}  `;
                            } else {
                                remarks = remarks + `SPOUSE WORKING DETAIL  NA `;
                            }

                            if (cases[i].vehicle) {
                                remarks = remarks + `VEHICLE DETAIL  ${cases[i].vehicle}  ${cases[i].vehicleRemarks ? cases[i].vehicleRemarks : ""}  `;
                            } else {
                                remarks = remarks + `VEHICLE DETAIL  NA `;
                            }
                            if (cases[i].houseArea) {
                                remarks = remarks + `OBSERVATION DETAIL HOUSE AREA  ${cases[i].houseArea}  INTERIOR CONDITION  ${cases[i].resiInterior.replace(/[^a-zA-Z0-9 ]/g, "")}  EXTERIOR CONDITION  ${cases[i].resiExterior.replace(/[^a-zA-Z0-9 ]/g, "")}  HOUSE CONDITION  ${cases[i].houseCondition.replace(/[^a-zA-Z0-9 ]/g, "")} `;
                            } else {
                                remarks = remarks + `OBSERVATION DETAIL NA `;
                            }
                            if (cases[i].remarks) {
                                remarks = remarks + `AGRI DETAIL ${cases[i].remarks} `;
                            } else {
                                remarks = remarks + `AGRI DETAIL NA `;
                            }
                            if (cases[i].neighbourCheck1) {
                                remarks = remarks + `NEIGHBOUR CHECK  NAME1 ${cases[i].neighbourCheck1} ${cases[i].neighbourCheck1Remarks}  NAME2 ${cases[i].neighbourCheck2} ${cases[i].neighbourCheck2Remarks} `;
                            } else {
                                remarks = remarks + `NEIGHBOUR CHECK  NA `;
                            }
                            if (cases[i].distance) {
                                remarks = remarks + `DISTANCE FROM BRANCH  ${cases[i].distance} `;
                            } else {
                                remarks + remarks + `DISTANCE FROM BRANCH   NA `;
                            }
                            if (cases[i].caseStatus) {
                                remarks = remarks + `STATUS  ${cases[i].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[i].caseStatusRemarks ? cases[i].caseStatusRemarks : ""} `;
                            } else {
                                remarks = remarks + `STATUS  NA `;
                            }
                            if (cases[i].lat) {
                                remarks = remarks + `LAT LON  ${cases[i].lat} ${cases[i].long} `;
                            } else {
                                remarks = remarks + `LAT LON  NA `;
                            }
                        }
                        const addressTypeMap = {
                            'PV': 'pv',
                            'RV': 'rv',
                            'BV': 'bv',
                        };
                        const addressType = cases[i].addressType;
                        if (addressType in addressTypeMap) {
                            cases[i][addressTypeMap[addressType]] = cases[i][addressTypeMap[addressType]] || {};
                            cases[i][addressTypeMap[addressType]].address = cases[i].address;
                            cases[i][addressTypeMap[addressType]].remark = remarks;
                            cases[i][addressTypeMap[addressType]].distance = cases[i].distance;
                        }
                    };
                    if (cases[i].addressType === 'PV') {
                        continue;
                    }
                    for (let j = i + 1; j < cases.length; j++) {

                        if (cases[i].addressType === cases[j].addressType && (cases[i].fileNo === cases[j].fileNo || cases[i].mobileNo === cases[j].mobileNo)) {
                            cases[j] = 0;
                        }
                        if (typeof cases[j] === 'object' && typeof cases[i] === 'object' && cases[i].addressType !== cases[j].addressType) {



                            if (cases[i].date === cases[j].date && cases[i].time === cases[j].time && (cases[i].fileNo === cases[j].fileNo || cases[i].mobileNo === cases[j].mobileNo)) {

                                if (cases[j].addressType == "BV") {
                                    remarks = `GIVEN ADDRESS CONFIRM  ${cases[j].addressConfirm} `;
                                    if (cases[j].applicantAge) {
                                        remarks = `${remarks}` + ` APPLICANT AGE  ${cases[j].applicantAge} `;
                                    } else {
                                        remarks = `${remarks}` + ` APPLICANT AGE  NA `;
                                    }
                                    if (cases[j].contactedPersonName) {
                                        remarks = `${remarks}` + ` PERSON MET ${cases[j].contactedPersonName}  ${cases[j].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "")}  ${cases[j].contactedPersonDesignationRemarks ? cases[j].contactedPersonDesignationRemarks : ""} `;
                                    } else {
                                        remarks = `${remarks}` + ` PERSON MET NA `;
                                    }
                                    if (cases[j].natureOfBusiness) {
                                        remarks = `${remarks}` + ` NATURE OF WORK  ${cases[j].natureOfBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[j].natureOfBusinessRemarks} ${cases[j].nOfBR2} `;
                                    } else {
                                        remarks = `${remarks}` + ` NATURE OF WORK  NA `;
                                    }
                                    if (cases[j].workingFrom) {
                                        remarks = remarks + ` WORKING YEAR  ${cases[j].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `;
                                    } else {
                                        remarks = remarks + ` WORKING YEAR  NA `;
                                    }
                                    if (cases[j].applicantDesignation) {
                                        remarks = remarks + ` DESIGNATION  ${cases[j].applicantDesignation.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[j].applicantDesignationRemarks ? cases[j].applicantDesignationRemarks : ""} `;
                                    } else {
                                        remarks = remarks + ` DESIGNATION  NA `;
                                    }
                                    if (cases[j].applicantOccupation == "SALARIED") {
                                        remarks = remarks + ` SALARY  ${cases[j].totalIncome ? cases[j].totalIncome : "NA"} `;
                                    } else {
                                        remarks = remarks + ` INCOME  ${cases[j].totalIncome ? cases[j].totalIncome : "NA"} `;
                                    }
                                    remarks = remarks + ` BUSINESS BOARD SEEN  ${cases[j].businessBoard ? cases[j].businessBoard.replace(/[^a-zA-Z0-9 ]/g, "") : "NA"}`;
                                    if (cases[j].businessBoardNameConfirmation) {
                                        remarks = remarks + ` SAME NAME  ${cases[j].businessBoardNameConfirmation}${cases[j].businessBoardNameRemarks ? cases[j].businessBoardNameRemarks : ""} `;
                                    } else {
                                        remarks = remarks + `SAME NAME  NA `;
                                    }
                                    if (cases[j].businessActivitySeen) {
                                        remarks = remarks + `WORKING ACTIVITY SEEN  ${cases[j].businessActivitySeen} ${cases[j].businessActivity} `;
                                    } else {
                                        remarks = remarks + `WORKING ACTIVITY SEEN  NA `;
                                    }
                                    if (cases[j].stockSeen) {
                                        remarks = remarks + `STOCK SEEN ${cases[j].stockSeen}  ${cases[j].stock} `;
                                    } else {
                                        remarks = remarks + `STOCK SEEN  NA `;
                                    }
                                    if (cases[j].noOfEmployees) {
                                        remarks = remarks + `NO OF EMPLOYEES  ${cases[j].noOfEmployees} `;
                                    } else {
                                        remarks = remarks + `NO OF EMPLOYEES  NA `;
                                    }
                                    if (cases[j].premisesBusiness) {
                                        remarks = remarks + `OFFICE PREMISES  ${cases[j].premisesBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[j].premisesBusinessRemarks ? cases[j].premisesBusinessRemarks : ""} `;
                                    } else {
                                        remarks = remarks + `OFFICE PREMISES   NA `;
                                    }
                                    remarks =
                                        remarks + `ADDITIONAL REMARK ${cases[j].remarks ? cases[j].remarks : "NA"} `;
                                    if (cases[j].neighbourCheck1) {
                                        remarks = remarks + `NEIGHBOUR CHECK NAME1 ${cases[j].neighbourCheck1} ${cases[j].neighbourCheck1Remarks} NAME2 ${cases[j].neighbourCheck2} ${cases[j].neighbourCheck2Remarks} `;
                                    } else {
                                        remarks = remarks + `NEIGHBOUR CHECK  NA `;
                                    }
                                    if (cases[j].distance) {
                                        remarks = remarks + `DISTANCE FROM BRANCH  ${cases[j].distance} `;
                                    } else {
                                        remarks = remarks + `DISTANCE FROM  BRANCH  NA `;
                                    }
                                    if (cases[j].caseStatus) {
                                        remarks = remarks + `STATUS  ${cases[j].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[j].caseStatusRemarks ? cases[j].caseStatusRemarks : ""} `;
                                    } else {
                                        remarks = remarks + `STATUS  NA `;
                                    }
                                    if (cases[j].lat) {
                                        remarks = remarks + `LAT LON ${cases[j].lat} ${cases[j].long} `;
                                    } else {
                                        remarks = remarks + `LAT LON  NA `;
                                    }
                                } else {
                                    remarks = `GIVEN ADDRESS CONFIRM  ${cases[j].addressConfirm} `;
                                    if (cases[j].applicantAge) {
                                        remarks = `${remarks}` + ` APPLICANT AGE  ${cases[j].applicantAge} `;
                                    } else {
                                        remarks = `${remarks}` + ` APPLICANT AGE  NA `;
                                    }
                                    if (cases[j].contactedPersonName) {
                                        remarks = `${remarks}` + `PERSON MET  ${cases[j].contactedPersonName} ${cases[j].contactedPersonDesignation.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[j].contactedPersonDesignationRemarks ? cases[j].contactedPersonDesignationRemarks : ""} `;
                                    } else {
                                        remarks = `${remarks}` + `PERSON MET  NA `;
                                    }
                                    if (cases[j].premisesResidence) {
                                        remarks = remarks + `RESIDENCE OWNERSHIP  PREMISES  ${cases[j].premisesResidence.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[j].premisesResidenceRemarks ? cases[j].premisesResidenceRemarks : ""} LOCATION OF RESIDENCE  ${cases[j].locationOfResi.replace(/[^a-zA-Z0-9 ]/g, "")} TYPE OF RESIDENCE  ${cases[j].typeOfResi.replace(/[^a-zA-Z0-9 ]/g, "")}${cases[j].typeOfResiRemarks ? cases[j].typeOfResiRemarks : ""} AREA LOCALITY  ${cases[j].areaLocality.replace(/[^a-zA-Z0-9 ]/g, "")} `;
                                    } else {
                                        remarks = remarks + `RESIDENCE OWNERSHIP   NA `;
                                    }
                                    if (cases[j].workingFrom) {
                                        remarks = remarks + `NO OF YEAR STAY  ${cases[j].workingFrom.replace(/[^a-zA-Z0-9 ]/g, "")} `;
                                    } else {
                                        remarks = remarks + `NO OF YEAR STAY  NA `;
                                    }
                                    if (cases[j].noOfFMember) {
                                        remarks =
                                            remarks + `FAMILY MEMBER ${cases[j].noOfFMember} `;
                                    } else {
                                        remarks = remarks + `FAMILY MEMBER NA `;
                                    }
                                    if (cases[j].noEarningMember) {
                                        remarks = remarks + `EARNING MEMBER  ${cases[j].noEarningMember} `;
                                    } else {
                                        remarks = remarks + `EARNING MEMBER  NA `;
                                    }
                                    if (cases[j].maritalStatus) {
                                        remarks = remarks + `MARITIAL STATUS  ${cases[j].maritalStatus.replace(/[^a-zA-Z0-9 ]/g, "")} `;
                                    } else {
                                        remarks = remarks + `MARITIAL STATUS  NA `;
                                    }
                                    if (cases[j].isSpouseWorking == "YES") {
                                        remarks = remarks + `SPOUSE WORKING DETAIL WORKING PLACE ${cases[j].spouseWorkingPlace.replace(/[^a-zA-Z0-9 ]/g, "")}  WORKING SINCE ${cases[j].spouseWorkingSince.replace(/[^a-zA-Z0-9 ]/g, "")}  SALARY ${cases[j].spouseSalary}  `;
                                    } else {
                                        remarks = remarks + `SPOUSE WORKING DETAIL  NA `;
                                    }

                                    if (cases[j].vehicle) {
                                        remarks = remarks + `VEHICLE DETAIL  ${cases[j].vehicle}  ${cases[j].vehicleRemarks ? cases[j].vehicleRemarks : ""}  `;
                                    } else {
                                        remarks = remarks + `VEHICLE DETAIL  NA `;
                                    }
                                    if (cases[j].houseArea) {
                                        remarks = remarks + `OBSERVATION DETAIL HOUSE AREA  ${cases[j].houseArea}  INTERIOR CONDITION  ${cases[j].resiInterior.replace(/[^a-zA-Z0-9 ]/g, "")}  EXTERIOR CONDITION  ${cases[j].resiExterior.replace(/[^a-zA-Z0-9 ]/g, "")}  HOUSE CONDITION  ${cases[j].houseCondition.replace(/[^a-zA-Z0-9 ]/g, "")} `;
                                    } else {
                                        remarks = remarks + `OBSERVATION DETAIL NA `;
                                    }
                                    if (cases[j].remarks) {
                                        remarks = remarks + `AGRI DETAIL ${cases[j].remarks} `;
                                    } else {
                                        remarks = remarks + `AGRI DETAIL NA `;
                                    }
                                    if (cases[j].neighbourCheck1) {
                                        remarks = remarks + `NEIGHBOUR CHECK  NAME1 ${cases[j].neighbourCheck1} ${cases[j].neighbourCheck1Remarks}  NAME2 ${cases[j].neighbourCheck2} ${cases[j].neighbourCheck2Remarks} `;
                                    } else {
                                        remarks = remarks + `NEIGHBOUR CHECK  NA `;
                                    }
                                    if (cases[j].distance) {
                                        remarks = remarks + `DISTANCE FROM BRANCH  ${cases[j].distance} `;
                                    } else {
                                        remarks + remarks + `DISTANCE FROM BRANCH   NA `;
                                    }
                                    if (cases[j].caseStatus) {
                                        remarks = remarks + `STATUS  ${cases[j].caseStatus.replace(/[^a-zA-Z0-9 ]/g, "")} ${cases[j].caseStatusRemarks ? cases[j].caseStatusRemarks : ""} `;
                                    } else {
                                        remarks = remarks + `STATUS  NA `;
                                    }
                                    if (cases[j].lat) {
                                        remarks = remarks + `LAT LON  ${cases[j].lat} ${cases[j].long} `;
                                    } else {
                                        remarks = remarks + `LAT LON  NA `;
                                    }
                                }
                                const addressTypeMap = {
                                    'PV': 'pv',
                                    'RV': 'rv',
                                    'BV': 'bv',
                                };
                                const addressType = cases[j].addressType;
                                if (addressType in addressTypeMap) {
                                    cases[i][addressTypeMap[addressType]] = {};
                                    cases[i][addressTypeMap[addressType]].address = cases[j].address;
                                    cases[i][addressTypeMap[addressType]].remark = remarks;
                                    cases[i][addressTypeMap[addressType]].distance = cases[j].distance;
                                }
                                if (cases[j].point > cases[i].point) {
                                    cases[i].point = cases[j].point
                                }
                                cases[j] = 0;
                            }
                        }
                    }
                }
                cases = cases.filter(item => item !== 0);
                for (let i = 0; i < cases.length; i++) {
                    delete cases[i]._id;
                    const pvCaseDistance = parseInt(cases[i].pv?.distance || 0);
                    const bvCaseDistance = parseInt(cases[i].bv?.distance || 0);
                    const rvCaseDistance = parseInt(cases[i].rv?.distance || 0);
                    const caseDistance = Math.max(pvCaseDistance, bvCaseDistance, rvCaseDistance);

                    const point = cases[i].point;
                    const matchedRate = findMatchingRate(caseDistance, point, rates);
                    if (matchedRate) {
                        cases[i].rate = parseInt(matchedRate.rate);
                        cases[i].uniqueId = data.uniqueId
                    } else {
                        throw new Error("No matching rate found for case: " + 'area' + cases[i].area + 'product' + cases[i].product + 'bank' + cases[i].bank + 'km' + cases[i].distance);
                    }
                };
                invoiceExcelData = await invoiceServices.createInvoiceExcelData(cases);
                if (invoiceExcelData.code === 401) {
                    const update = {
                        status: 'failed',
                        error: invoiceExcelData.message
                    }
                    await invoiceServices.updateInvoiceExcelDataStatus({ uniqueId: data.uniqueId }, update)
                } else {
                    const update = {
                        status: 'success',
                    }
                    await invoiceServices.updateInvoiceExcelDataStatus({ uniqueId: data.uniqueId }, update)
                }
                break;
            default:
                throw new Error('invalid excel format');
        }
    } catch (error) {
        const update = {
            status: 'failed',
            error: error.message
        }
        await invoiceServices.updateInvoiceExcelDataStatus({ uniqueId: data.uniqueId }, update);
    }
};

function findMatchingRate(distance, point, rates) {
    try {
        for (let i = 0; i < rates.length; i++) {
            const rate = rates[i];
            if (distance >= rate.from && distance <= rate.to && point === rate.point) {
                return rate;
            }
        }
        return null;

    } catch (error) {
        throw error
    }

}

export default invoiceExcel;


