import { Response, Router } from "express";
import Messages from "messages"
import getDateTime from "@/helpers/getCurrentDateTime";
import Helper from "@/utils/helper";
import e from "connect-flash";


const esgFields = [
    'forcedLabourChildLabour',
    'politicalConnection',
    'gambling',
    'tobaccoTrading',
    'pornography',
    'armsAmmunition',
    'other',
];

function validateESGData(reqBody) {
    console.log("reqBody>>>>>>>>>>>>>>>>>>>>>>>.",reqBody)
    for (const field of esgFields) {
        const status = reqBody[field + 'Status'];
        const specify = reqBody[field + 'Specify'];
        console.log("status>>>>>>>>>>>>>>>>>>>>>>>.",status)
        console.log("specify>>>>>>>>>>>>>>>>>>>>>>>.",specify)
        if (!status || (status === 'YES' && !specify)) {

            return false; // Validation failed
        }
    }

    return true; // All fields are valid
}

let validateReviewData = async (req: any, caseData: any) => {
    try {
        const isValid = validateESGData(req.body);
        console.log("isValid>>>>>>>>>>>>>>>>>>>>>>>>..",isValid)

        if (!isValid) {
            return Messages.Failed.CASES.ESG_MISSING
        }
        const esg = {
            forcedLabourChildLabour: {
                status: req.body.forcedLabourChildLabourStatus,
                specify: req.body.forcedLabourChildLabourSpecify,
            },
            politicalConnection: {
                status: req.body.politicalConnectionStatus,
                specify: req.body.politicalConnectionSpecify,
            },
            gambling: {
                status: req.body.gamblingStatus,
                specify: req.body.gamblingSpecify,
            },
            tobaccoTrading: {
                status: req.body.tobaccoTradingStatus,
                specify: req.body.tobaccoTradingSpecify,
            },
            pornography: {
                status: req.body.pornographyStatus,
                specify: req.body.pornographySpecify,
            },
            armsAmmunition: {
                status: req.body.armsAmmunitionStatus,
                specify: req.body.armsAmmunitionSpecify,
            },
            other: {
                status: req.body.otherStatus,
                specify: req.body.otherSpecify,
            }
        }
        if (!req.body.imageStatus) {
            return Messages.Failed.CASES.IMAGE_STATUS_REQ
        }

        if (req.body.imageStatus === 'NO' && !req.body.imageStatusRemarks) {
            return Messages.Failed.CASES.IMAGE_STATUS_REM_REQ
        }

        const imageAllowed = {
            status: req.body.imageStatus,
            reason: req.body.imageStatusRemarks
        }


        let documents = []
        let filePath = []
        let objectToBeUpdate: any = {}
        objectToBeUpdate.esg = esg;
        objectToBeUpdate.imageAllowed = imageAllowed
        let x = new Helper();
        if (req.user.role == "field-executive") {
            if (req.body.lat && req.body.lon) {
                objectToBeUpdate.lat = req.body.lat;
                objectToBeUpdate.long = req.body.lon;
            } else {
                return Messages.Failed.CASES.CORDINATES
            }
        }
        if (req.user.role == "field-executive") {
            if (req.body.documents) {
                if (req.body.documents.length <= 8 && req.body.documents.length >= 2) {
                    for (let i = 0; i < req.body.documents.length; i++) {
                        documents[i] = req.body.documents[i].url
                    }
                    objectToBeUpdate.documents = documents
                } else {
                    return Messages.Failed.CASES.DOCUMENTS_UPLOADED
                }
            } else {
                return Messages.Failed.CASES.DOCUMENTS_UPLOADED
            }
        }
        if (!req.body.resend) {
            if (req.body.easeOfLocating && ["EASY", "DIFFICULT", "UNTRACEABLE"].includes(req.body.easeOfLocating.toUpperCase())) {
                objectToBeUpdate.easeOfLocating = req.body.easeOfLocating.toUpperCase()
            } else {
                return Messages.Failed.CASES.EASEOFLOCATING
            }
            if (req.body.neighbourCheck1 && req.body.neighbourCheck2 && req.body.neighbourCheck1Remarks && req.body.neighbourCheck2Remarks && ["POSITIVE", "NEGATIVE", "UNKNOWN"].includes(req.body.neighbourCheck1Remarks.toUpperCase()) && ["POSITIVE", "NEGATIVE", "UNKNOWN"].includes(req.body.neighbourCheck2Remarks.toUpperCase())) {
                objectToBeUpdate.neighbourCheck1 = req.body.neighbourCheck1
                objectToBeUpdate.neighbourCheck2 = req.body.neighbourCheck2
                objectToBeUpdate.neighbourCheck1Remarks = req.body.neighbourCheck1Remarks.toUpperCase()
                objectToBeUpdate.neighbourCheck2Remarks = req.body.neighbourCheck2Remarks.toUpperCase()
            } else {
                return Messages.Failed.CASES.NEIGHBOUR_CHECK
            }
            if (req.body.remarks) {
                objectToBeUpdate.remarks = req.body.remarks;
            }
            if (req.body.distance) {
                objectToBeUpdate.distance = req.body.distance;
            } else {
                return Messages.Failed.CASES.DISTANCE
            }
            if (req.user.role != "field-executive") {
                if (req.body.caseStatus && ["POSITIVE", "NEGATIVE", "REFER_TO_CREDIT"].includes(req.body.caseStatus.toUpperCase())) {
                    objectToBeUpdate.caseStatus = req.body.caseStatus.toUpperCase();
                    if (req.body.caseStatus.toUpperCase() == "NEGATIVE" || req.body.caseStatus.toUpperCase() == "REFER_TO_CREDIT") {
                        if (req.body.caseStatusRemarks) {
                            objectToBeUpdate.caseStatusRemarks = req.body.caseStatusRemarks
                        } else {
                            return Messages.Failed.CASES.CASE_STATUS_REMARKS
                        }
                    } else {
                        objectToBeUpdate.caseStatusRemarks = ""
                    }
                } else {
                    return Messages.Failed.CASES.CASE_STATUS
                }
                if (req.body.agencyName && ["MB_MANAGEMENT", "CMB_MANAGEMENT_SOLUTION_PVT_LTD", "TIME_MANAGEMENT_SERVICES"].includes(req.body.agencyName.toUpperCase())) {
                    objectToBeUpdate.agencyName = req.body.agencyName.toUpperCase();
                } else {
                    return Messages.Failed.CASES.AGENCY_NAME
                }
            }
            if (req.body.landMark) {
                objectToBeUpdate.landMark = req.body.landMark
            } else {
                return Messages.Failed.CASES.LANDMARK
            }
        }
        // **************** conditions for bv cases *************************************************************************
        if (caseData.addressType.trim().toUpperCase() == "BV") {
            if (req.body.resend == "resend") {
                objectToBeUpdate = {
                    cordinates: "",
                    addressConfirm: "",
                    addressConfirmByFieldExecutive: "",
                    addressConfirmByFieldExecutiveRemarks: "",
                    contactedPersonName: "",
                    contactedPersonDesignation: "",
                    applicantOccupation: "",
                    workingFrom: "",
                    premisesBusiness: "",
                    premisesBusinessRemarks: "",
                    areaType: "",
                    businessBoard: "",
                    businessBoardSpecify: "",
                    businessBoardNameConfirmation: "",
                    businessBoardNameRemarks: "",
                    natureOfBusiness: "",
                    natureOfBusinessRemarks: "",
                    nOfBR2: "",
                    totalIncome: "",
                    stockSeen: "",
                    stock: "",
                    businessActivitySeen: "",
                    businessActivity: "",
                    noOfEmployees: "",
                    negativeProfile: "",
                    negativeProfileRemarks: "",
                    neighbourCheck1: "",
                    neighbourCheck2: "",
                    neighbourCheck1Remarks: "",
                    neighbourCheck2Remarks: "",
                    distance: "",
                    applicantStayAddress: "",
                    premisesResidence: "",
                    premisesResidenceRemarks: "",
                    staySinceSameAddress: "",
                    documents: "",
                    acceptedBy: "",
                    staySinceSameAddressMonth: "",
                    staySinceSameAddressYear: "",
                    officeSetup: "",
                    landMark: "",
                    easeOfLocating: "",
                    officeLock: "",
                    applicantStayAddressConfirm: "",
                    applicantDesignation: "",
                    applicantDesignationRemarks: "",
                    remarks: "",
                    caseStatus: "",
                    caseStatusRemarks: "",
                    agencyName: "",
                    applicantAge: "",
                    entryAllowed: "",
                    dateVisit: "",
                    timeVisit: "",
                    lat: "",
                    long: "",
                    esg: "",
                    imageAllowed:""
                }
            } else {
                if (req.body.addressConfirm) {
                    objectToBeUpdate.addressConfirm = req.body.addressConfirm.toUpperCase()
                    if (req.body.addressConfirm.toUpperCase() == "YES") {
                        if (req.body.addressConfirmByFieldExecutive && ["SAME", "NOT_SAME"].includes(req.body.addressConfirmByFieldExecutive.toUpperCase())) {
                            objectToBeUpdate.addressConfirmByFieldExecutive = req.body.addressConfirmByFieldExecutive.toUpperCase();
                            if (req.body.addressConfirmByFieldExecutive.toUpperCase() == "NOT_SAME") {
                                if (req.body.addressConfirmByFieldExecutiveRemarks) {
                                    objectToBeUpdate.addressConfirmByFieldExecutiveRemarks = req.body.addressConfirmByFieldExecutiveRemarks
                                } else {
                                    return Messages.Failed.CASES.ADDRESS_FIELD_REQUIRED
                                }
                            } else {
                                objectToBeUpdate.addressConfirmByFieldExecutiveRemarks = ""
                            }
                        } else {
                            return Messages.Failed.CASES.ADDRESS_FIELD_BY_FIELDEXECUTIVE
                        }
                        if (req.body.officeLock && ["YES", "NO"].includes(req.body.officeLock.toUpperCase())) {
                            objectToBeUpdate.officeLock = req.body.officeLock.toUpperCase();
                            if (req.body.officeLock.toUpperCase() == "YES") {
                                if (req.body.businessBoard && ["YES", "NO", "MISMATCH", "TEMPORARY"].includes(req.body.businessBoard.toUpperCase())) {
                                    objectToBeUpdate.businessBoard = req.body.businessBoard.toUpperCase();
                                    if (req.body.businessBoard.toUpperCase() == "YES") {
                                        if (req.body.businessBoardNameConfirmation && ["YES", "NO"].includes(req.body.businessBoardNameConfirmation.toUpperCase())) {
                                            objectToBeUpdate.businessBoardNameConfirmation = req.body.businessBoardNameConfirmation.toUpperCase()
                                            if (req.body.businessBoardNameConfirmation.toUpperCase() == "NO") {
                                                if (req.body.businessBoardNameRemarks) {
                                                    objectToBeUpdate.businessBoardNameRemarks = req.body.businessBoardNameRemarks.toUpperCase()
                                                } else {
                                                    return Messages.Failed.CASES.BUSINESS_BOARD_NAME_REMARKS
                                                }
                                            } else {
                                                objectToBeUpdate.businessBoardNameRemarks = ""
                                            }
                                        } else {
                                            return Messages.Failed.CASES.BUSINESS_BOARD_NAME_CONFIRMATION
                                        }
                                    } else {
                                        objectToBeUpdate.businessBoardNameConfirmation = ""
                                        if ((req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") && (!req.body.businessBoardSpecify)) {
                                            return Messages.Failed.CASES.BUSINESS_BOARD_SPECIFY
                                        } else if (req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") {
                                            objectToBeUpdate.businessBoardSpecify = req.body.businessBoardSpecify
                                        }
                                    }
                                } else {
                                    return Messages.Failed.CASES.BUSINESS_BOARD
                                }
                                objectToBeUpdate.contactedPersonName = ""
                                objectToBeUpdate.contactedPersonDesignation = ""
                                objectToBeUpdate.contactedPersonDesignationRemarks = ""
                                objectToBeUpdate.applicantOccupation = ""
                                objectToBeUpdate.workingFrom = ""
                                objectToBeUpdate.premisesBusiness = ""
                                objectToBeUpdate.premisesBusinessRemarks = ""
                                objectToBeUpdate.areaType = ""
                                objectToBeUpdate.natureOfBusiness = ""
                                objectToBeUpdate.natureOfBusinessRemarks = ""
                                objectToBeUpdate.nOfBR2 = ""
                                objectToBeUpdate.totalIncome = ""
                                objectToBeUpdate.stockSeen = ""
                                objectToBeUpdate.stock = ""
                                objectToBeUpdate.businessActivitySeen = ""
                                objectToBeUpdate.businessActivity = ""
                                objectToBeUpdate.noOfEmployees = ""
                                objectToBeUpdate.negativeProfile = ""
                                objectToBeUpdate.negativeProfileRemarks = ""
                                objectToBeUpdate.premisesResidence = ""
                                objectToBeUpdate.premisesResidenceRemarks = ""
                                objectToBeUpdate.premisesResidence = ""
                                objectToBeUpdate.premisesResidenceRemarks = ""
                                objectToBeUpdate.staySinceSameAddressYear = ""
                                objectToBeUpdate.staySinceSameAddressMonth = ""
                                objectToBeUpdate.applicantDesignation = ""
                                objectToBeUpdate.applicantDesignationRemarks = ""
                                objectToBeUpdate.officeSetup = ""
                                objectToBeUpdate.applicantStayAddressConfirm = ""
                                objectToBeUpdate.applicantAge = ""
                                objectToBeUpdate.entryAllowed = ""

                            } else {
                                if (req.body.entryAllowed && ["YES", "NO"].includes(req.body.entryAllowed.toUpperCase())) {
                                    objectToBeUpdate.entryAllowed = req.body.entryAllowed.toUpperCase()
                                    if (req.body.entryAllowed.toUpperCase() == "NO") {
                                        if (req.body.businessBoard && ["YES", "NO", "MISMATCH", "TEMPORARY"].includes(req.body.businessBoard.toUpperCase())) {
                                            objectToBeUpdate.businessBoard = req.body.businessBoard.toUpperCase();
                                            if (req.body.businessBoard.toUpperCase() == "YES") {
                                                if (req.body.businessBoardNameConfirmation && ["YES", "NO"].includes(req.body.businessBoardNameConfirmation.toUpperCase())) {
                                                    objectToBeUpdate.businessBoardNameConfirmation = req.body.businessBoardNameConfirmation.toUpperCase()
                                                    if (req.body.businessBoardNameConfirmation.toUpperCase() == "NO") {
                                                        if (req.body.businessBoardNameRemarks) {
                                                            objectToBeUpdate.businessBoardNameRemarks = req.body.businessBoardNameRemarks.toUpperCase()
                                                        } else {
                                                            return Messages.Failed.CASES.BUSINESS_BOARD_NAME_REMARKS
                                                        }
                                                    } else {
                                                        objectToBeUpdate.businessBoardNameRemarks = ""
                                                    }
                                                } else {
                                                    return Messages.Failed.CASES.BUSINESS_BOARD_NAME_CONFIRMATION
                                                }
                                            } else {
                                                objectToBeUpdate.businessBoardNameConfirmation = ""
                                                if ((req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") && (!req.body.businessBoardSpecify)) {
                                                    return Messages.Failed.CASES.BUSINESS_BOARD_SPECIFY
                                                } else if (req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") {
                                                    objectToBeUpdate.businessBoardSpecify = req.body.businessBoardSpecify
                                                }
                                            }
                                        } else {
                                            return Messages.Failed.CASES.BUSINESS_BOARD
                                        }
                                        objectToBeUpdate.contactedPersonName = ""
                                        objectToBeUpdate.contactedPersonDesignation = ""
                                        objectToBeUpdate.contactedPersonDesignationRemarks = ""
                                        objectToBeUpdate.applicantOccupation = ""
                                        objectToBeUpdate.workingFrom = ""
                                        objectToBeUpdate.premisesBusiness = ""
                                        objectToBeUpdate.premisesBusinessRemarks = ""
                                        objectToBeUpdate.areaType = ""
                                        objectToBeUpdate.natureOfBusiness = ""
                                        objectToBeUpdate.natureOfBusinessRemarks = ""
                                        objectToBeUpdate.totalIncome = ""
                                        objectToBeUpdate.stockSeen = ""
                                        objectToBeUpdate.stock = ""
                                        objectToBeUpdate.businessActivitySeen = ""
                                        objectToBeUpdate.businessActivity = ""
                                        objectToBeUpdate.noOfEmployees = ""
                                        objectToBeUpdate.negativeProfile = ""
                                        objectToBeUpdate.negativeProfileRemarks = ""
                                        objectToBeUpdate.premisesResidence = ""
                                        objectToBeUpdate.premisesResidenceRemarks = ""
                                        objectToBeUpdate.premisesResidence = ""
                                        objectToBeUpdate.premisesResidenceRemarks = ""
                                        objectToBeUpdate.staySinceSameAddressYear = ""
                                        objectToBeUpdate.staySinceSameAddressMonth = ""
                                        objectToBeUpdate.applicantDesignation = ""
                                        objectToBeUpdate.applicantDesignationRemarks = ""
                                        objectToBeUpdate.officeSetup = ""
                                        objectToBeUpdate.applicantStayAddressConfirm = ""
                                        objectToBeUpdate.applicantAge = ""
                                    } else {
                                        if (req.body.applicantDesignation && ["COLLEAGUE", "OFFICE_OWNER", "MANAGER", "ACCOUNTANT", "HR", "GUARD", "PARTNER", "DIRECTOR", "STAFF", "OTHER"].includes(req.body.applicantDesignation.toUpperCase())) {
                                            objectToBeUpdate.applicantDesignation = req.body.applicantDesignation.toUpperCase()
                                            if (req.body.applicantDesignation.toUpperCase() == "OTHER") {
                                                if (req.body.applicantDesignationRemarks) {
                                                    objectToBeUpdate.applicantDesignationRemarks = req.body.applicantDesignationRemarks
                                                } else {
                                                    return Messages.Failed.CASES.APPLICANT_DESIGNATION_REMARKS
                                                }
                                            } else {
                                                objectToBeUpdate.applicantDesignationRemarks = ""
                                            }
                                        } else {
                                            return Messages.Failed.CASES.APPLICANT_DESIGNATION
                                        }
                                        if (req.body.officeSetup && ["PROPER", "TEMPORARY"].includes(req.body.officeSetup.toUpperCase())) {
                                            objectToBeUpdate.officeSetup = req.body.officeSetup.toUpperCase()
                                        } else {
                                            return Messages.Failed.CASES.OFFICE_SETUP
                                        }
                                        if (req.body.applicantAge) {
                                            objectToBeUpdate.applicantAge = req.body.applicantAge
                                        } else {
                                            return Messages.Failed.CASES.APPLICANT_AGE
                                        }
                                        if (req.body.contactedPersonName) {
                                            objectToBeUpdate.contactedPersonName = req.body.contactedPersonName.toUpperCase()
                                        } else {
                                            return Messages.Failed.CASES.CONTACTED_PERSON_NAME
                                        }
                                        if (req.body.contactedPersonDesignation && ["COLLEAGUE", "OFFICE_OWNER", "MANAGER", "ACCOUNTANT", "HR", "GUARD", "PARTNER", "DIRECTOR", "STAFF", "OTHER", "SELF"].includes(req.body.contactedPersonDesignation.toUpperCase())) {
                                            objectToBeUpdate.contactedPersonDesignation = req.body.contactedPersonDesignation.toUpperCase()
                                            if (req.body.contactedPersonDesignation.toUpperCase() == "OTHER") {
                                                if (req.body.contactedPersonDesignationRemarks) {
                                                    objectToBeUpdate.contactedPersonDesignationRemarks =
                                                        req.body.contactedPersonDesignationRemarks;
                                                } else {
                                                    return Messages.Failed.CASES.CONTACTED_PERSON_DESIGNATION_REMARKS;
                                                }
                                            }
                                        } else {
                                            return Messages.Failed.CASES.CONTACTED_PERSON_DESIGNATION
                                        }
                                        if (req.body.applicantOccupation && ["SALARIED", "SELF_EMPLOYED"].includes(req.body.applicantOccupation.toUpperCase())) {
                                            objectToBeUpdate.applicantOccupation = req.body.applicantOccupation.toUpperCase()
                                            if (req.body.applicantOccupation.toUpperCase() == "SELF_EMPLOYED") {
                                                if (req.body.premisesBusiness && ["RENTED", "LEASE", "BUSINESS_CENTRE", "LOAN", "SELF_OWNED", "SHARED", "OTHER", "COMPANY_OWNED"].includes(req.body.premisesBusiness.toUpperCase())) {
                                                    objectToBeUpdate.premisesBusiness = req.body.premisesBusiness.toUpperCase();
                                                    if (req.body.premisesBusiness.toUpperCase() == "RENTED" || req.body.premisesBusiness.toUpperCase() == "OTHER") {
                                                        if (req.body.premisesBusinessRemarks) {
                                                            objectToBeUpdate.premisesBusinessRemarks = req.body.premisesBusinessRemarks.toUpperCase()
                                                        } else {
                                                            return Messages.Failed.CASES.PREMISES_BUSINESS_REMARKS
                                                        }
                                                    } else {
                                                        objectToBeUpdate.premisesBusinessRemarks = ""
                                                    }
                                                } else {
                                                    return Messages.Failed.CASES.PREMISES_BUSINESS
                                                }
                                            }
                                        } else {
                                            return Messages.Failed.CASES.APPLICANT_OCCUPATION
                                        }
                                        if (req.body.workingFrom && ["LESS_THAN_1_YEAR", "1_TO_2_YEARS", "2_TO_5_YEARS", "5_TO_10_YEARS", "10_&_ABOVE_YEARS"].includes(req.body.workingFrom.toUpperCase())) {
                                            objectToBeUpdate.workingFrom = req.body.workingFrom.toUpperCase()
                                        } else {
                                            return Messages.Failed.CASES.WORKING_FROM
                                        }
                                        if (req.body.areaType && ["RESIDENTIAL", "COMMERCIAL", "SEMI_COMMERCIAL", "INDUSTRIAL", "RURAL", "COMMUNITY_DOMINATED"].includes(req.body.areaType.toUpperCase())) {
                                            objectToBeUpdate.areaType = req.body.areaType.toUpperCase()
                                        } else {
                                            return Messages.Failed.CASES.AREA_TYPE
                                        }
                                        if (req.body.businessBoard && ["YES", "NO", "MISMATCH", "TEMPORARY"].includes(req.body.businessBoard.toUpperCase())) {
                                            objectToBeUpdate.businessBoard = req.body.businessBoard.toUpperCase();
                                            if (req.body.businessBoard.toUpperCase() == "YES") {
                                                if (req.body.businessBoardNameConfirmation && ["YES", "NO"].includes(req.body.businessBoardNameConfirmation.toUpperCase())) {
                                                    objectToBeUpdate.businessBoardNameConfirmation = req.body.businessBoardNameConfirmation.toUpperCase()
                                                    if (req.body.businessBoardNameConfirmation.toUpperCase() == "NO") {
                                                        if (req.body.businessBoardNameRemarks) {
                                                            objectToBeUpdate.businessBoardNameRemarks = req.body.businessBoardNameRemarks.toUpperCase()
                                                        } else {
                                                            return Messages.Failed.CASES.BUSINESS_BOARD_NAME_REMARKS
                                                        }
                                                    } else {
                                                        objectToBeUpdate.businessBoardNameRemarks = ""
                                                    }
                                                } else {
                                                    return Messages.Failed.CASES.BUSINESS_BOARD_NAME_CONFIRMATION
                                                }
                                            } else {
                                                objectToBeUpdate.businessBoardNameConfirmation = ""
                                                if ((req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") && (!req.body.businessBoardSpecify)) {
                                                    return Messages.Failed.CASES.BUSINESS_BOARD_SPECIFY
                                                } else if (req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") {
                                                    objectToBeUpdate.businessBoardSpecify = req.body.businessBoardSpecify
                                                }
                                            }
                                        } else {
                                            return Messages.Failed.CASES.BUSINESS_BOARD
                                        }
                                        if (req.body.natureOfBusiness && ["TRADING", "MANUFACTURING", "SERVICE", "COMMISSION_AGENT", "JOB_WORK", "OTHER"].includes(req.body.natureOfBusiness.toUpperCase())) {
                                            objectToBeUpdate.natureOfBusiness = req.body.natureOfBusiness.toUpperCase();
                                            if (req.body.natureOfBusiness.toUpperCase() == "OTHER") {
                                                if (req.body.natureOfBusinessRemarks) {
                                                    objectToBeUpdate.natureOfBusinessRemarks = req.body.natureOfBusinessRemarks;
                                                } else {
                                                    return Messages.Failed.CASES.NATURE_OF_BUSINESS_REMARKS
                                                }
                                            } else {
                                                objectToBeUpdate.natureOfBusinessRemarks = "";
                                            }
                                        } else {
                                            return Messages.Failed.CASES.NATURE_OF_BUSINESS
                                        }
                                        if (req.body.nOfBR2) {
                                            objectToBeUpdate.nOfBR2 = req.body.nOfBR2
                                        }
                                        if (req.body.totalIncome) {
                                            objectToBeUpdate.totalIncome = req.body.totalIncome
                                        } else {
                                            return Messages.Failed.CASES.TOTAL_INCOME
                                        }
                                        if (req.body.stockSeen && ["YES", "NO"].includes(req.body.stockSeen.toUpperCase())) {
                                            objectToBeUpdate.stockSeen = req.body.stockSeen.toUpperCase();
                                            if (req.body.stockSeen.toUpperCase() == "YES") {
                                                if (req.body.stock && ["HIGH", "MEDIUM", "LOW"].includes(req.body.stock.toUpperCase())) {
                                                    objectToBeUpdate.stock = req.body.stock.toUpperCase();
                                                } else {
                                                    return Messages.Failed.CASES.STOCK
                                                }
                                            } else {
                                                objectToBeUpdate.stock = ""
                                            }
                                        } else {
                                            return Messages.Failed.CASES.STOCK_SEEN
                                        }
                                        if (req.body.businessActivitySeen && ["YES", "NO"].includes(req.body.businessActivitySeen.toUpperCase())) {
                                            objectToBeUpdate.businessActivitySeen = req.body.businessActivitySeen.toUpperCase();
                                            if (req.body.businessActivitySeen.toUpperCase() == "YES") {
                                                if (req.body.businessActivity && ["HIGH", "MEDIUM", "LOW"].includes(req.body.businessActivity.toUpperCase())) {
                                                    objectToBeUpdate.businessActivity = req.body.businessActivity.toUpperCase()
                                                } else {
                                                    return Messages.Failed.CASES.BUSINESS_ACTIVITY
                                                }
                                            } else {
                                                objectToBeUpdate.businessActivity = ""
                                            }
                                        } else {
                                            return Messages.Failed.CASES.BUSINESS_ACTIVITY_SEEN
                                        }
                                        if (req.body.noOfEmployees) {
                                            objectToBeUpdate.noOfEmployees = req.body.noOfEmployees
                                        } else {
                                            return Messages.Failed.CASES.NO_OF_EMPOLOYEES
                                        }
                                        if (req.body.negativeProfile && ["YES", "NO"].includes(req.body.negativeProfile.toUpperCase())) {
                                            objectToBeUpdate.negativeProfile = req.body.negativeProfile.toUpperCase();
                                            if (req.body.negativeProfile.toUpperCase() == "YES") {
                                                if (req.body.negativeProfileRemarks) {
                                                    objectToBeUpdate.negativeProfileRemarks = req.body.negativeProfileRemarks.toUpperCase();
                                                } else {
                                                    return Messages.Failed.CASES.NEGATIVE_PROFILE_REMARKS
                                                }
                                            } else {
                                                objectToBeUpdate.negativeProfileRemarks = ""
                                            }
                                        } else {
                                            return Messages.Failed.CASES.NEGATIVE_PROFILE
                                        }
                                        if (req.body.applicantStayAddressConfirm && ["YES", "NO"].includes(req.body.applicantStayAddressConfirm.toUpperCase())) {
                                            objectToBeUpdate.applicantStayAddressConfirm = req.body.applicantStayAddressConfirm.toUpperCase();
                                            if (req.body.applicantStayAddressConfirm.toUpperCase() == "YES") {
                                                if (req.body.applicantStayAddress) {
                                                    objectToBeUpdate.applicantStayAddress = req.body.applicantStayAddress;
                                                } else {
                                                    return Messages.Failed.CASES.APPLICANT_STAY_ADDRESS
                                                }
                                                if (req.body.premisesResidence && ["SELF_OWNED", "LEASE", "SHARED", "RENTED", "COMPANY_OWNED", "OTHER"].includes(req.body.premisesResidence.toUpperCase())) {
                                                    objectToBeUpdate.premisesResidence = req.body.premisesResidence.toUpperCase();
                                                    if (req.body.premisesResidence.toUpperCase() == "OTHER" || req.body.premisesResidence.toUpperCase() == "RENTED") {
                                                        if (req.body.premisesResidenceRemarks) {
                                                            objectToBeUpdate.premisesResidenceRemarks = req.body.premisesResidenceRemarks;
                                                        } else {
                                                            return Messages.Failed.CASES.PREMISES_RESIDENCE_REMARKS
                                                        }
                                                    } else {
                                                        objectToBeUpdate.premisesresidenceRemarks = "";
                                                    }
                                                } else {
                                                    return Messages.Failed.CASES.PREMISES_RESIDENCE
                                                }
                                                if (req.body.staySinceSameAddressYear && req.body.staySinceSameAddressMonth) {
                                                    objectToBeUpdate.staySinceSameAddressYear = parseInt(req.body.staySinceSameAddressYear);
                                                    objectToBeUpdate.staySinceSameAddressMonth = parseInt(req.body.staySinceSameAddressMonth)
                                                } else {
                                                    return Messages.Failed.CASES.STAY_SAME_ADDRESS
                                                }
                                            }
                                        } else {
                                            return Messages.Failed.CASES.APPLICANT_STAY_ADDRESS_CONFIRM
                                        }
                                        if (req.body.addressConfirmByFieldExecutive && ["SAME", "NOT_SAME"].includes(req.body.addressConfirmByFieldExecutive.toUpperCase())) {
                                            objectToBeUpdate.addressConfirmByFieldExecutive = req.body.addressConfirmByFieldExecutive.toUpperCase();
                                            if (req.body.addressConfirmByFieldExecutive.toUpperCase() == "NOT_SAME") {
                                                if (req.body.addressConfirmByFieldExecutiveRemarks) {
                                                    objectToBeUpdate.addressConfirmByFieldExecutiveRemarks = req.body.addressConfirmByFieldExecutiveRemarks
                                                } else {
                                                    return Messages.Failed.CASES.ADDRESS_FIELD_REQUIRED
                                                }
                                            } else {
                                                objectToBeUpdate.addressConfirmByFieldExecutiveRemarks = ""
                                            }
                                        } else {
                                            return Messages.Failed.CASES.ADDRESS_FIELD_BY_FIELDEXECUTIVE
                                        }
                                    }
                                } else {
                                    if (req.body.applicantDesignation && ["COLLEAGUE", "OFFICE_OWNER", "MANAGER", "ACCOUNTANT", "HR", "GUARD", "PARTNER", "DIRECTOR", "STAFF", "OTHER"].includes(req.body.applicantDesignation.toUpperCase())) {
                                        objectToBeUpdate.applicantDesignation = req.body.applicantDesignation.toUpperCase()
                                        if (req.body.applicantDesignation.toUpperCase() == "OTHER") {
                                            if (req.body.applicantDesignationRemarks) {
                                                objectToBeUpdate.applicantDesignationRemarks = req.body.applicantDesignationRemarks
                                            } else {
                                                return Messages.Failed.CASES.APPLICANT_DESIGNATION_REMARKS
                                            }
                                        } else {
                                            objectToBeUpdate.applicantDesignationRemarks = ""
                                        }
                                    } else {
                                        return Messages.Failed.CASES.APPLICANT_DESIGNATION
                                    }
                                    if (req.body.officeSetup && ["PROPER", "TEMPORARY"].includes(req.body.officeSetup.toUpperCase())) {
                                        objectToBeUpdate.officeSetup = req.body.officeSetup.toUpperCase()
                                    } else {
                                        return Messages.Failed.CASES.OFFICE_SETUP
                                    }
                                    if (req.body.applicantAge) {
                                        objectToBeUpdate.applicantAge = req.body.applicantAge
                                    } else {
                                        return Messages.Failed.CASES.APPLICANT_AGE
                                    }
                                    if (req.body.contactedPersonName) {
                                        objectToBeUpdate.contactedPersonName = req.body.contactedPersonName.toUpperCase()
                                    } else {
                                        return Messages.Failed.CASES.CONTACTED_PERSON_NAME
                                    }
                                    if (req.body.contactedPersonDesignation && ["COLLEAGUE", "OFFICE_OWNER", "MANAGER", "ACCOUNTANT", "HR", "GUARD", "PARTNER", "DIRECTOR", "STAFF", "OTHER", "SELF"].includes(req.body.contactedPersonDesignation.toUpperCase())) {
                                        objectToBeUpdate.contactedPersonDesignation = req.body.contactedPersonDesignation.toUpperCase()
                                        if (req.body.contactedPersonDesignation.toUpperCase() == "OTHER") {
                                            if (req.body.contactedPersonDesignationRemarks) {
                                                objectToBeUpdate.contactedPersonDesignationRemarks =
                                                    req.body.contactedPersonDesignationRemarks;
                                            } else {
                                                return Messages.Failed.CASES.CONTACTED_PERSON_DESIGNATION_REMARKS;
                                            }
                                        }
                                    } else {
                                        return Messages.Failed.CASES.CONTACTED_PERSON_DESIGNATION
                                    }
                                    if (req.body.applicantOccupation && ["SALARIED", "SELF_EMPLOYED"].includes(req.body.applicantOccupation.toUpperCase())) {
                                        objectToBeUpdate.applicantOccupation = req.body.applicantOccupation.toUpperCase()
                                        if (req.body.applicantOccupation.toUpperCase() == "SELF_EMPLOYED") {
                                            if (req.body.premisesBusiness && ["RENTED", "LEASE", "BUSINESS_CENTRE", "LOAN", "SELF_OWNED", "SHARED", "OTHER", "COMPANY_OWNED"].includes(req.body.premisesBusiness.toUpperCase())) {
                                                objectToBeUpdate.premisesBusiness = req.body.premisesBusiness.toUpperCase();
                                                if (req.body.premisesBusiness.toUpperCase() == "RENTED" || req.body.premisesBusiness.toUpperCase() == "OTHER") {
                                                    if (req.body.premisesBusinessRemarks) {
                                                        objectToBeUpdate.premisesBusinessRemarks = req.body.premisesBusinessRemarks.toUpperCase()
                                                    } else {
                                                        return Messages.Failed.CASES.PREMISES_BUSINESS_REMARKS
                                                    }
                                                } else {
                                                    objectToBeUpdate.premisesBusinessRemarks = ""
                                                }
                                            } else {
                                                return Messages.Failed.CASES.PREMISES_BUSINESS
                                            }
                                        }
                                    } else {
                                        return Messages.Failed.CASES.APPLICANT_OCCUPATION
                                    }
                                    if (req.body.workingFrom && ["LESS_THAN_1_YEAR", "1_TO_2_YEARS", "2_TO_5_YEARS", "5_TO_10_YEARS", "10_&_ABOVE_YEARS"].includes(req.body.workingFrom.toUpperCase())) {
                                        objectToBeUpdate.workingFrom = req.body.workingFrom.toUpperCase()
                                    } else {
                                        return Messages.Failed.CASES.WORKING_FROM
                                    }
                                    if (req.body.areaType && ["RESIDENTIAL", "COMMERCIAL", "SEMI_COMMERCIAL", "INDUSTRIAL", "RURAL", "COMMUNITY_DOMINATED"].includes(req.body.areaType.toUpperCase())) {
                                        objectToBeUpdate.areaType = req.body.areaType.toUpperCase()
                                    } else {
                                        return Messages.Failed.CASES.AREA_TYPE
                                    }
                                    if (req.body.businessBoard && ["YES", "NO", "MISMATCH", "TEMPORARY"].includes(req.body.businessBoard.toUpperCase())) {
                                        objectToBeUpdate.businessBoard = req.body.businessBoard.toUpperCase();
                                        if (req.body.businessBoard.toUpperCase() == "YES") {
                                            if (req.body.businessBoardNameConfirmation && ["YES", "NO"].includes(req.body.businessBoardNameConfirmation.toUpperCase())) {
                                                objectToBeUpdate.businessBoardNameConfirmation = req.body.businessBoardNameConfirmation.toUpperCase()
                                                if (req.body.businessBoardNameConfirmation.toUpperCase() == "NO") {
                                                    if (req.body.businessBoardNameRemarks) {
                                                        objectToBeUpdate.businessBoardNameRemarks = req.body.businessBoardNameRemarks.toUpperCase()
                                                    } else {
                                                        return Messages.Failed.CASES.BUSINESS_BOARD_NAME_REMARKS
                                                    }
                                                } else {
                                                    objectToBeUpdate.businessBoardNameRemarks = ""
                                                }
                                            } else {
                                                return Messages.Failed.CASES.BUSINESS_BOARD_NAME_CONFIRMATION
                                            }
                                        } else {
                                            objectToBeUpdate.businessBoardNameConfirmation = "";
                                            if ((req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") && (!req.body.businessBoardSpecify)) {
                                                return Messages.Failed.CASES.BUSINESS_BOARD_SPECIFY
                                            } else if (req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") {
                                                objectToBeUpdate.businessBoardSpecify = req.body.businessBoardSpecify
                                            }
                                        }
                                    } else {
                                        return Messages.Failed.CASES.BUSINESS_BOARD
                                    }
                                    if (req.body.natureOfBusiness && ["TRADING", "MANUFACTURING", "SERVICE", "COMMISSION_AGENT", "JOB_WORK", "OTHER"].includes(req.body.natureOfBusiness.toUpperCase())) {
                                        objectToBeUpdate.natureOfBusiness = req.body.natureOfBusiness.toUpperCase();
                                        if (req.body.natureOfBusiness.toUpperCase() == "OTHER") {
                                            if (req.body.natureOfBusinessRemarks) {
                                                objectToBeUpdate.natureOfBusinessRemarks = req.body.natureOfBusinessRemarks;
                                            } else {
                                                return Messages.Failed.CASES.NATURE_OF_BUSINESS_REMARKS
                                            }
                                        } else {
                                            objectToBeUpdate.natureOfBusinessRemarks = "";
                                        }
                                    } else {
                                        return Messages.Failed.CASES.NATURE_OF_BUSINESS
                                    }
                                    if (req.body.nOfBR2) {
                                        objectToBeUpdate.nOfBR2 = req.body.nOfBR2
                                    }
                                    if (req.body.totalIncome) {
                                        objectToBeUpdate.totalIncome = req.body.totalIncome
                                    } else {
                                        return Messages.Failed.CASES.TOTAL_INCOME
                                    }
                                    if (req.body.stockSeen && ["YES", "NO"].includes(req.body.stockSeen.toUpperCase())) {
                                        objectToBeUpdate.stockSeen = req.body.stockSeen.toUpperCase();
                                        if (req.body.stockSeen.toUpperCase() == "YES") {
                                            if (req.body.stock && ["HIGH", "MEDIUM", "LOW"].includes(req.body.stock.toUpperCase())) {
                                                objectToBeUpdate.stock = req.body.stock.toUpperCase();
                                            } else {
                                                return Messages.Failed.CASES.STOCK
                                            }
                                        } else {
                                            objectToBeUpdate.stock = ""
                                        }
                                    } else {
                                        return Messages.Failed.CASES.STOCK_SEEN
                                    }
                                    if (req.body.businessActivitySeen && ["YES", "NO"].includes(req.body.businessActivitySeen.toUpperCase())) {
                                        objectToBeUpdate.businessActivitySeen = req.body.businessActivitySeen.toUpperCase();
                                        if (req.body.businessActivitySeen.toUpperCase() == "YES") {
                                            if (req.body.businessActivity && ["HIGH", "MEDIUM", "LOW"].includes(req.body.businessActivity.toUpperCase())) {
                                                objectToBeUpdate.businessActivity = req.body.businessActivity.toUpperCase()
                                            } else {
                                                return Messages.Failed.CASES.BUSINESS_ACTIVITY
                                            }
                                        } else {
                                            objectToBeUpdate.businessActivity = ""
                                        }
                                    } else {
                                        return Messages.Failed.CASES.BUSINESS_ACTIVITY_SEEN
                                    }
                                    if (req.body.noOfEmployees) {
                                        objectToBeUpdate.noOfEmployees = req.body.noOfEmployees
                                    } else {
                                        return Messages.Failed.CASES.NO_OF_EMPOLOYEES
                                    }
                                    if (req.body.negativeProfile && ["YES", "NO"].includes(req.body.negativeProfile.toUpperCase())) {
                                        objectToBeUpdate.negativeProfile = req.body.negativeProfile.toUpperCase();
                                        if (req.body.negativeProfile.toUpperCase() == "YES") {
                                            if (req.body.negativeProfileRemarks) {
                                                objectToBeUpdate.negativeProfileRemarks = req.body.negativeProfileRemarks.toUpperCase();
                                            } else {
                                                return Messages.Failed.CASES.NEGATIVE_PROFILE_REMARKS
                                            }
                                        } else {
                                            objectToBeUpdate.negativeProfileRemarks = ""
                                        }
                                    } else {
                                        return Messages.Failed.CASES.NEGATIVE_PROFILE
                                    }
                                    if (req.body.applicantStayAddressConfirm && ["YES", "NO"].includes(req.body.applicantStayAddressConfirm.toUpperCase())) {
                                        objectToBeUpdate.applicantStayAddressConfirm = req.body.applicantStayAddressConfirm.toUpperCase();
                                        if (req.body.applicantStayAddressConfirm.toUpperCase() == "YES") {
                                            if (req.body.applicantStayAddress) {
                                                objectToBeUpdate.applicantStayAddress = req.body.applicantStayAddress;
                                            } else {
                                                return Messages.Failed.CASES.APPLICANT_STAY_ADDRESS
                                            }
                                            if (req.body.premisesResidence && ["SELF_OWNED", "LEASE", "SHARED", "RENTED", "COMPANY_OWNED", "OTHER"].includes(req.body.premisesResidence.toUpperCase())) {
                                                objectToBeUpdate.premisesResidence = req.body.premisesResidence.toUpperCase();
                                                if (req.body.premisesResidence.toUpperCase() == "OTHER" || req.body.premisesResidence.toUpperCase() == "RENTED") {
                                                    if (req.body.premisesResidenceRemarks) {
                                                        objectToBeUpdate.premisesResidenceRemarks = req.body.premisesResidenceRemarks;
                                                    } else {
                                                        return Messages.Failed.CASES.PREMISES_RESIDENCE_REMARKS
                                                    }
                                                } else {
                                                    objectToBeUpdate.premisesresidenceRemarks = "";
                                                }
                                            } else {
                                                return Messages.Failed.CASES.PREMISES_RESIDENCE
                                            }
                                            if (req.body.staySinceSameAddressYear && req.body.staySinceSameAddressMonth) {
                                                objectToBeUpdate.staySinceSameAddressYear = parseInt(req.body.staySinceSameAddressYear);
                                                objectToBeUpdate.staySinceSameAddressMonth = parseInt(req.body.staySinceSameAddressMonth)
                                            } else {
                                                return Messages.Failed.CASES.STAY_SAME_ADDRESS
                                            }
                                        }
                                    } else {
                                        return Messages.Failed.CASES.APPLICANT_STAY_ADDRESS_CONFIRM
                                    }
                                    if (req.body.addressConfirmByFieldExecutive && ["SAME", "NOT_SAME"].includes(req.body.addressConfirmByFieldExecutive.toUpperCase())) {
                                        objectToBeUpdate.addressConfirmByFieldExecutive = req.body.addressConfirmByFieldExecutive.toUpperCase();
                                        if (req.body.addressConfirmByFieldExecutive.toUpperCase() == "NOT_SAME") {
                                            if (req.body.addressConfirmByFieldExecutiveRemarks) {
                                                objectToBeUpdate.addressConfirmByFieldExecutiveRemarks = req.body.addressConfirmByFieldExecutiveRemarks
                                            } else {
                                                return Messages.Failed.CASES.ADDRESS_FIELD_REQUIRED
                                            }
                                        } else {
                                            objectToBeUpdate.addressConfirmByFieldExecutiveRemarks = ""
                                        }
                                    } else {
                                        return Messages.Failed.CASES.ADDRESS_FIELD_BY_FIELDEXECUTIVE
                                    }
                                }
                            }
                        } else {
                            return Messages.Failed.CASES.OFFICE_LOCK
                        }
                    } else if (req.body.addressConfirm.toUpperCase() == "NO") {
                        objectToBeUpdate.contactedPersonName = "";
                        objectToBeUpdate.applicantAge = "";
                        objectToBeUpdate.contactedPersonDesignation = "";
                        objectToBeUpdate.contactedPersonDesignationRemarks = "";
                        objectToBeUpdate.applicantOccupation = ""
                        objectToBeUpdate.workingFrom = ""
                        objectToBeUpdate.premisesBusiness = ""
                        objectToBeUpdate.premisesBusinessRemarks = ""
                        objectToBeUpdate.areaType = ""
                        objectToBeUpdate.businessBoard = ""
                        objectToBeUpdate.businessBoardNameConfirmation = ""
                        objectToBeUpdate.businessBoardNameRemarks = ""
                        objectToBeUpdate.businessBoardSpecify = ""
                        objectToBeUpdate.natureOfBusiness = ""
                        objectToBeUpdate.natureOfBusinessRemarks = ""
                        objectToBeUpdate.totalIncome = ""
                        objectToBeUpdate.stockSeen = ""
                        objectToBeUpdate.stock = ""
                        objectToBeUpdate.businessActivitySeen = ""
                        objectToBeUpdate.businessActivity = ""
                        objectToBeUpdate.noOfEmployees = ""
                        objectToBeUpdate.negativeProfile = ""
                        objectToBeUpdate.negativeProfileRemarks = ""
                        objectToBeUpdate.premisesResidence = ""
                        objectToBeUpdate.premisesResidenceRemarks = ""
                        objectToBeUpdate.premisesResidence = ""
                        objectToBeUpdate.premisesResidenceRemarks = ""
                        objectToBeUpdate.staySinceSameAddressYear = ""
                        objectToBeUpdate.staySinceSameAddressMonth = ""
                        objectToBeUpdate.officeLock = ""
                        objectToBeUpdate.applicantDesignation = ""
                        objectToBeUpdate.applicantDesignationRemarks = ""
                        objectToBeUpdate.officeSetup = ""
                        objectToBeUpdate.applicantStayAddressConfirm = ""
                        objectToBeUpdate.entryAllowed = ""


                    } else {
                        return Messages.Failed.CASES.ADDRESS_CONFIRMATION_REQUIRED
                    }
                } else {
                    return Messages.Failed.CASES.ADDRESS_CONFIRMATION_REQUIRED
                }
            }
            if (req.user.role != "field-executive") {
                if (req.files) {
                    if (req.files.imageFile1) {

                        filePath[0] = req.files.imageFile1[0].key;
                        // x.addWaterMark(filePath[0], req.body)
                    } else {
                        if (req.body.duplicateImageFile1) {
                            filePath[0] = req.body.duplicateImageFile1
                        }
                    }
                    if (req.files.imageFile2) {


                        filePath[1] = req.files.imageFile2[0].key
                        // x.addWaterMark(filePath[1], req.body)
                    } else {
                        if (req.body.duplicateImageFile2) {
                            filePath[1] = req.body.duplicateImageFile2
                        }
                    }
                    if (req.files.imageFile3) {


                        filePath[2] = req.files.imageFile3[0].key
                        // x.addWaterMark(filePath[2], req.body)
                    } else {
                        if (req.body.duplicateImageFile3) {
                            filePath[2] = req.body.duplicateImageFile3
                        }
                    }
                    if (req.files.imageFile4) {

                        filePath[3] = req.files.imageFile4[0].key
                        // x.addWaterMark(filePath[3], req.body)
                    } else {
                        if (req.body.duplicateImageFile4) {
                            filePath[3] = req.body.duplicateImageFile4
                        }
                    }
                    if (req.files.imageFile5) {

                        filePath[4] = req.files.imageFile5[0].key
                        // x.addWaterMark(filePath[3], req.body)
                    } else {
                        if (req.body.duplicateImageFile5) {
                            filePath[4] = req.body.duplicateImageFile5
                        }
                    }
                    if (req.files.imageFile6) {

                        filePath[5] = req.files.imageFile6[0].key
                        // x.addWaterMark(filePath[5], req.body)
                    } else {
                        if (req.body.duplicateImageFile6) {
                            filePath[5] = req.body.duplicateImageFile6
                        }
                    }
                    if (req.files.imageFile7) {

                        filePath[6] = req.files.imageFile7[0].key
                        // x.addWaterMark(filePath[6], req.body)
                    } else {
                        if (req.body.duplicateImageFile7) {
                            filePath[6] = req.body.duplicateImageFile7
                        }
                    }
                    if (req.files.imageFile8) {

                        filePath[7] = req.files.imageFile8[0].key
                        // x.addWaterMark(filePath[7], req.body)
                    } else {
                        if (req.body.duplicateImageFile8) {
                            filePath[7] = req.body.duplicateImageFile8
                        }
                    }
                    objectToBeUpdate.documents = filePath;
                }
            }
            return objectToBeUpdate
        } else {
            // ************************************************** condition for pv and rv cases **********************************
            if (req.body.resend == "resend") {
                objectToBeUpdate = {
                    cordinates: "",
                    addressConfirm: "",
                    addressConfirmByFieldExecutive: "",
                    addressConfirmByFieldExecutiveRemarks: "",
                    contactedPersonName: "",
                    contactedPersonDesignation: "",
                    contactedPersonDesignationRemarks: "",
                    applicantOccupation: "",
                    workingFrom: "",
                    maritalStatus: "",
                    isSpouseWorking: "",
                    spouseWorkingPlace: "",
                    spouseWorkingSince: "",
                    spouseSalary: "",
                    noOfFMember: "",
                    noEarningMember: "",
                    premisesResidence: "",
                    premisesResidenceRemarks: "",
                    locationOfResi: "",
                    typeOfResi: "",
                    typeOfResiRemarks: "",
                    areaLocality: "",
                    houseArea: "",
                    resiInterior: "",
                    resiExterior: "",
                    houseCondition: "",
                    vehicle: "",
                    vehicleRemarks: "",
                    businessBoard: "",
                    businessBoardNameConfirmation: "",
                    businessBoardNameRemarks: "",
                    businessBoardSpecify: "",
                    totalIncome: "",
                    negativeProfile: "",
                    negativeProfileRemarks: "",
                    neighbourCheck1: "",
                    neighbourCheck2: "",
                    neighbourCheck1Remarks: "",
                    neighbourCheck2Remarks: "",
                    distance: "",
                    documents: "",
                    acceptedBy: "",
                    landMark: "",
                    easeOfLocating: "",
                    officeLock: "",
                    applicantStayAddressConfirm: "",
                    applicantDesignation: "",
                    applicantDesignationRemarks: "",
                    applicantAge: "",
                    remarks: "",
                    caseStatus: "",
                    agencyName: "",
                    caseStatusRemarks: "",
                    entryAllowed: "",
                    dateVisit: "",
                    timeVisit: "",
                    lat: "",
                    long: "",
                    esg: "",
                    imageAllowed:""
                }
            } else {
                if (req.body.addressConfirm) {
                    objectToBeUpdate.addressConfirm = req.body.addressConfirm.toUpperCase()
                    if (req.body.addressConfirm.toUpperCase() == "YES") {
                        if (req.body.addressConfirmByFieldExecutive && ["SAME", "NOT_SAME"].includes(req.body.addressConfirmByFieldExecutive.toUpperCase())) {
                            objectToBeUpdate.addressConfirmByFieldExecutive = req.body.addressConfirmByFieldExecutive.toUpperCase();
                            if (req.body.addressConfirmByFieldExecutive.toUpperCase() == "NOT_SAME") {
                                if (req.body.addressConfirmByFieldExecutiveRemarks) {
                                    objectToBeUpdate.addressConfirmByFieldExecutiveRemarks = req.body.addressConfirmByFieldExecutiveRemarks
                                } else {
                                    return Messages.Failed.CASES.ADDRESS_FIELD_REQUIRED
                                }
                            } else {
                                objectToBeUpdate.addressConfirmByFieldExecutiveRemarks = ""
                            }
                        } else {
                            return Messages.Failed.CASES.ADDRESS_FIELD_BY_FIELDEXECUTIVE
                        }
                        if (req.body.officeLock && ["YES", "NO"].includes(req.body.officeLock.toUpperCase())) {
                            objectToBeUpdate.officeLock = req.body.officeLock.toUpperCase();
                            if (req.body.officeLock.toUpperCase() == "YES") {
                                if (req.body.businessBoard && ["YES", "NO", "MISMATCH", "TEMPORARY"].includes(req.body.businessBoard.toUpperCase())) {
                                    objectToBeUpdate.businessBoard = req.body.businessBoard.toUpperCase();
                                    if (req.body.businessBoard.toUpperCase() == "YES") {
                                        if (req.body.businessBoardNameConfirmation && ["YES", "NO"].includes(req.body.businessBoardNameConfirmation.toUpperCase())) {
                                            objectToBeUpdate.businessBoardNameConfirmation = req.body.businessBoardNameConfirmation.toUpperCase()
                                            if (req.body.businessBoardNameConfirmation.toUpperCase() == "NO") {
                                                if (req.body.businessBoardNameRemarks) {
                                                    objectToBeUpdate.businessBoardNameRemarks = req.body.businessBoardNameRemarks.toUpperCase()
                                                } else {
                                                    return Messages.Failed.CASES.BUSINESS_BOARD_NAME_REMARKS
                                                }
                                            } else {
                                                objectToBeUpdate.businessBoardNameRemarks = ""
                                            }
                                        } else {
                                            return Messages.Failed.CASES.BUSINESS_BOARD_NAME_CONFIRMATION
                                        }
                                    } else {
                                        objectToBeUpdate.businessBoardNameConfirmation = ""
                                        if ((req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") && (!req.body.businessBoardSpecify)) {
                                            return Messages.Failed.CASES.BUSINESS_BOARD_SPECIFY
                                        } else if (req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") {
                                            objectToBeUpdate.businessBoardSpecify = req.body.businessBoardSpecify
                                        }
                                    }
                                } else {
                                    return Messages.Failed.CASES.BUSINESS_BOARD
                                }
                                objectToBeUpdate.contactedPersonName = ""
                                objectToBeUpdate.contactedPersonDesignation = ""
                                objectToBeUpdate.contactedPersonDesignationRemarks = ""
                                objectToBeUpdate.applicantOccupation = ""
                                objectToBeUpdate.workingFrom = ""
                                objectToBeUpdate.premisesResidence = ""
                                objectToBeUpdate.premisesResidenceRemarks = ""
                                objectToBeUpdate.applicantDesignation = ""
                                objectToBeUpdate.applicantDesignationRemarks = ""
                                objectToBeUpdate.maritalStatus = ""
                                objectToBeUpdate.isSpouseWorking = ""
                                objectToBeUpdate.spouseWorkingPlace = ""
                                objectToBeUpdate.spouseWorkingSince = ""
                                objectToBeUpdate.spouseSalary = ""
                                objectToBeUpdate.noOfFMember = ""
                                objectToBeUpdate.noEarningMember = ""
                                objectToBeUpdate.locationOfResi = ""
                                objectToBeUpdate.typeOfResi = ""
                                objectToBeUpdate.typeOfResiRemarks = ""
                                objectToBeUpdate.areaLocality = ""
                                objectToBeUpdate.houseArea = ""
                                objectToBeUpdate.resiInterior = ""
                                objectToBeUpdate.resiExterior = ""
                                objectToBeUpdate.houseCondition = ""
                                objectToBeUpdate.vehicle = ""
                                objectToBeUpdate.vehicleRemarks = ""
                                objectToBeUpdate.totalIncome = ""
                                objectToBeUpdate.negativeProfile = ""
                                objectToBeUpdate.negativeProfileRemarks = ""
                                objectToBeUpdate.applicantAge = ""

                            } else {
                                if (req.body.entryAllowed && ["YES", "NO"].includes(req.body.entryAllowed.toUpperCase())) {
                                    objectToBeUpdate.entryAllowed = req.body.entryAllowed.toUpperCase()
                                    if (req.body.entryAllowed.toUpperCase() == "NO") {
                                        if (req.body.businessBoard && ["YES", "NO", "MISMATCH", "TEMPORARY"].includes(req.body.businessBoard.toUpperCase())) {
                                            objectToBeUpdate.businessBoard = req.body.businessBoard.toUpperCase();
                                            if (req.body.businessBoard.toUpperCase() == "YES") {
                                                if (req.body.businessBoardNameConfirmation && ["YES", "NO"].includes(req.body.businessBoardNameConfirmation.toUpperCase())) {
                                                    objectToBeUpdate.businessBoardNameConfirmation = req.body.businessBoardNameConfirmation.toUpperCase()
                                                    if (req.body.businessBoardNameConfirmation.toUpperCase() == "NO") {
                                                        if (req.body.businessBoardNameRemarks) {
                                                            objectToBeUpdate.businessBoardNameRemarks = req.body.businessBoardNameRemarks.toUpperCase()
                                                        } else {
                                                            return Messages.Failed.CASES.BUSINESS_BOARD_NAME_REMARKS
                                                        }
                                                    } else {
                                                        objectToBeUpdate.businessBoardNameRemarks = ""
                                                    }
                                                } else {
                                                    return Messages.Failed.CASES.BUSINESS_BOARD_NAME_CONFIRMATION
                                                }
                                            } else {
                                                objectToBeUpdate.businessBoardNameConfirmation = ""
                                                if ((req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") && (!req.body.businessBoardSpecify)) {
                                                    return Messages.Failed.CASES.BUSINESS_BOARD_SPECIFY
                                                } else if (req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") {
                                                    objectToBeUpdate.businessBoardSpecify = req.body.businessBoardSpecify
                                                }
                                            }
                                        } else {
                                            return Messages.Failed.CASES.BUSINESS_BOARD
                                        }
                                        objectToBeUpdate.contactedPersonName = ""
                                        objectToBeUpdate.contactedPersonDesignation = ""
                                        objectToBeUpdate.contactedPersonDesignationRemarks = ""
                                        objectToBeUpdate.applicantOccupation = ""
                                        objectToBeUpdate.workingFrom = ""
                                        objectToBeUpdate.premisesResidence = ""
                                        objectToBeUpdate.premisesResidenceRemarks = ""
                                        objectToBeUpdate.applicantDesignation = ""
                                        objectToBeUpdate.applicantDesignationRemarks = ""
                                        objectToBeUpdate.maritalStatus = ""
                                        objectToBeUpdate.isSpouseWorking = ""
                                        objectToBeUpdate.spouseWorkingPlace = ""
                                        objectToBeUpdate.spouseWorkingSince = ""
                                        objectToBeUpdate.spouseSalary = ""
                                        objectToBeUpdate.noOfFMember = ""
                                        objectToBeUpdate.noEarningMember = ""
                                        objectToBeUpdate.locationOfResi = ""
                                        objectToBeUpdate.typeOfResi = ""
                                        objectToBeUpdate.typeOfResiRemarks = ""
                                        objectToBeUpdate.areaLocality = ""
                                        objectToBeUpdate.houseArea = ""
                                        objectToBeUpdate.resiInterior = ""
                                        objectToBeUpdate.resiExterior = ""
                                        objectToBeUpdate.houseCondition = ""
                                        objectToBeUpdate.vehicle = ""
                                        objectToBeUpdate.vehicleRemarks = ""
                                        objectToBeUpdate.totalIncome = ""
                                        objectToBeUpdate.negativeProfile = ""
                                        objectToBeUpdate.negativeProfileRemarks = ""
                                        objectToBeUpdate.applicantAge = ""

                                    } else {
                                        if (req.body.applicantDesignation) {
                                            if (["COLLEAGUE", "OFFICE_OWNER", "MANAGER", "ACCOUNTANT", "HR", "GUARD", "PARTNER", "DIRECTOR", "STAFF", "OTHER"].includes(req.body.applicantDesignation.toUpperCase())) {
                                                objectToBeUpdate.applicantDesignation = req.body.applicantDesignation.toUpperCase()
                                                if (req.body.applicantDesignation.toUpperCase() == "OTHER") {
                                                    if (req.body.applicantDesignationRemarks) {
                                                        objectToBeUpdate.applicantDesignationRemarks = req.body.applicantDesignationRemarks
                                                    } else {
                                                        return Messages.Failed.CASES.APPLICANT_DESIGNATION_REMARKS
                                                    }
                                                } else {
                                                    objectToBeUpdate.applicantDesignationRemarks = ""
                                                }
                                            } else {
                                                return Messages.Failed.CASES.APPLICANT_DESIGNATION
                                            }

                                        }
                                        if (req.body.houseCondition && ["PROPER", "TEMPORARY"].includes(req.body.houseCondition.toUpperCase())) {
                                            objectToBeUpdate.houseCondition = req.body.houseCondition.toUpperCase()
                                        } else {
                                            return Messages.Failed.CASES.HOUSE_CONDITION
                                        }
                                        if (req.body.applicantAge) {
                                            objectToBeUpdate.applicantAge = req.body.applicantAge
                                        } else {
                                            return Messages.Failed.CASES.APPLICANT_AGE
                                        }
                                        if (req.body.contactedPersonName) {
                                            objectToBeUpdate.contactedPersonName = req.body.contactedPersonName.toUpperCase()
                                        } else {
                                            return Messages.Failed.CASES.CONTACTED_PERSON_NAME
                                        }
                                        if (req.body.contactedPersonDesignation && ["FATHER", "MOTHER", "HUSBAND", "WIFE", "BROTHER", "SISTER", "SON", "DAUGHTER", "OTHER", "SELF"].includes(req.body.contactedPersonDesignation.toUpperCase())) {
                                            objectToBeUpdate.contactedPersonDesignation = req.body.contactedPersonDesignation.toUpperCase()
                                            if (req.body.contactedPersonDesignation.toUpperCase() == "OTHER") {
                                                if (req.body.contactedPersonDesignationRemarks) {
                                                    objectToBeUpdate.contactedPersonDesignationRemarks =
                                                        req.body.contactedPersonDesignationRemarks;
                                                } else {
                                                    return Messages.Failed.CASES.CONTACTED_PERSON_DESIGNATION;
                                                }
                                            }
                                        } else {
                                            return Messages.Failed.CASES.CONTACTED_RELATION
                                        }
                                        if (req.body.applicantOccupation) {
                                            if (["SALARIED", "SELF_EMPLOYED"].includes(req.body.applicantOccupation.toUpperCase())) {
                                                objectToBeUpdate.applicantOccupation = req.body.applicantOccupation.toUpperCase()
                                            } else {
                                                return Messages.Failed.CASES.APPLICANT_OCCUPATION
                                            }
                                        }
                                        if (req.body.workingFrom && ["LESS_THAN_1_YEAR", "1_TO_2_YEARS", "2_TO_5_YEARS", "5_TO_10_YEARS", "10_&_ABOVE_YEARS", "SINCE_BIRTH"].includes(req.body.workingFrom.toUpperCase())) {
                                            objectToBeUpdate.workingFrom = req.body.workingFrom.toUpperCase()
                                        } else {
                                            return Messages.Failed.CASES.WORKING_FROM
                                        }
                                        if (req.body.businessBoard && ["YES", "NO", "MISMATCH", "TEMPORARY"].includes(req.body.businessBoard.toUpperCase())) {
                                            objectToBeUpdate.businessBoard = req.body.businessBoard.toUpperCase();
                                            if (req.body.businessBoard.toUpperCase() == "YES") {
                                                if (req.body.businessBoardNameConfirmation && ["YES", "NO"].includes(req.body.businessBoardNameConfirmation.toUpperCase())) {
                                                    objectToBeUpdate.businessBoardNameConfirmation = req.body.businessBoardNameConfirmation.toUpperCase()
                                                    if (req.body.businessBoardNameConfirmation.toUpperCase() == "NO") {
                                                        if (req.body.businessBoardNameRemarks) {
                                                            objectToBeUpdate.businessBoardNameRemarks = req.body.businessBoardNameRemarks.toUpperCase()
                                                        } else {
                                                            return Messages.Failed.CASES.BUSINESS_BOARD_NAME_REMARKS
                                                        }
                                                    } else {
                                                        objectToBeUpdate.businessBoardNameRemarks = ""
                                                    }
                                                } else {
                                                    return Messages.Failed.CASES.BUSINESS_BOARD_NAME_CONFIRMATION
                                                }
                                            } else {
                                                objectToBeUpdate.businessBoardNameConfirmation = ""
                                                if ((req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") && (!req.body.businessBoardSpecify)) {
                                                    return Messages.Failed.CASES.BUSINESS_BOARD_SPECIFY
                                                } else if (req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") {
                                                    objectToBeUpdate.businessBoardSpecify = req.body.businessBoardSpecify
                                                }
                                            }
                                        } else {
                                            return Messages.Failed.CASES.BUSINESS_BOARD
                                        }
                                        if (req.body.totalIncome) {
                                            objectToBeUpdate.totalIncome = req.body.totalIncome
                                        } else {
                                            return Messages.Failed.CASES.TOTAL_INCOME
                                        }
                                        if (req.body.negativeProfile && ["YES", "NO"].includes(req.body.negativeProfile.toUpperCase())) {
                                            objectToBeUpdate.negativeProfile = req.body.negativeProfile.toUpperCase();
                                            if (req.body.negativeProfile.toUpperCase() == "YES") {
                                                if (req.body.negativeProfileRemarks) {
                                                    objectToBeUpdate.negativeProfileRemarks = req.body.negativeProfileRemarks.toUpperCase();
                                                } else {
                                                    return Messages.Failed.CASES.NEGATIVE_PROFILE_REMARKS
                                                }
                                            } else {
                                                objectToBeUpdate.negativeProfileRemarks = ""
                                            }
                                        } else {
                                            return Messages.Failed.CASES.NEGATIVE_PROFILE
                                        }
                                        if (req.body.maritalStatus && ["MARRIED", "UNMARRIED"].includes(req.body.maritalStatus.toUpperCase())) {
                                            objectToBeUpdate.maritalStatus = req.body.maritalStatus.toUpperCase()
                                            if (req.body.maritalStatus.toUpperCase() == "MARRIED") {
                                                if (req.body.isSpouseWorking && ["YES", "NO"].includes(req.body.isSpouseWorking.toUpperCase())) {
                                                    objectToBeUpdate.isSpouseWorking = req.body.isSpouseWorking.toUpperCase()
                                                    if (req.body.isSpouseWorking.toUpperCase() == "YES") {
                                                        if (req.body.spouseWorkingPlace) {
                                                            objectToBeUpdate.spouseWorkingPlace = req.body.spouseWorkingPlace
                                                        } else {
                                                            return Messages.Failed.CASES.SPOUSE_WORKING_PLACE
                                                        }
                                                        if (req.body.spouseWorkingSince && ["LESS_THAN_1_YEAR", "1_TO_2_YEARS", "2_TO_5_YEARS", "5_TO_10_YEARS", "10_&_ABOVE_YEARS"].includes(req.body.spouseWorkingSince.toUpperCase())) {
                                                            objectToBeUpdate.spouseWorkingSince = req.body.spouseWorkingSince
                                                        } else {
                                                            return Messages.Failed.CASES.SPOUSE_WORKING_SINCE
                                                        }
                                                        if (req.body.spouseSalary) {
                                                            objectToBeUpdate.spouseSalary = req.body.spouseSalary
                                                        } else {
                                                            return Messages.Failed.CASES.SPOUSE_SALARY
                                                        }
                                                    }
                                                } else {
                                                    return Messages.Failed.CASES.SPOUSE_WORKING_STATUS
                                                }
                                            }
                                        } else {
                                            return Messages.Failed.CASES.MARITIAL_STATUS
                                        }
                                        if (req.body.noOfFMember) {
                                            objectToBeUpdate.noOfFMember = req.body.noOfFMember
                                        } else {
                                            return Messages.Failed.CASES.NO_F_FMEMBER
                                        }
                                        if (req.body.noEarningMember && parseInt(req.body.noOfFMember) >= parseInt(req.body.noEarningMember)) {
                                            objectToBeUpdate.noEarningMember = req.body.noEarningMember
                                        } else {
                                            return Messages.Failed.CASES.EARNING_MEMBER
                                        }
                                        if (req.body.locationOfResi && ["RESIDENTIAL", "COMMERCIAL", "SEMI_COMMERCIAL", "INDUSTRIAL", "RURAL", "COMMUNITY_DOMINATED"].includes(req.body.locationOfResi.toUpperCase())) {
                                            objectToBeUpdate.locationOfResi = req.body.locationOfResi.toUpperCase()
                                        } else {
                                            return Messages.Failed.CASES.LOCATION_OF_RESI
                                        }
                                        if (req.body.typeOfResi && ["INDEPENDENT_HOUSE", "CHAWL", "FLAT", "BUNGALOW", "RAW_HOUSE", "TEMPORARY_HOUSE", "OTHER"].includes(req.body.typeOfResi.toUpperCase())) {
                                            objectToBeUpdate.typeOfResi = req.body.typeOfResi.toUpperCase()
                                            if (req.body.typeOfResi.toUpperCase() == "OTHER") {
                                                if (req.body.typeOfResiRemarks) {
                                                    objectToBeUpdate.typeOfResiRemarks = req.body.typeOfResiRemarks
                                                } else {
                                                    return Messages.Failed.CASES.RESI_REMARKS
                                                }
                                            }
                                        } else {
                                            return Messages.Failed.CASES.TYPE_OF_RESI
                                        }
                                        if (req.body.areaLocality && ["UPPER_MIDDLE_CLASS", "MIDDLE_CLASS", "LOWER_MIDDLE_CLASS", "NEGATIVE"].includes(req.body.areaLocality.toUpperCase())) {
                                            objectToBeUpdate.areaLocality = req.body.areaLocality.toUpperCase()
                                        } else {
                                            return Messages.Failed.CASES.AREA_LOCALITY
                                        }
                                        if (req.body.houseArea) {
                                            objectToBeUpdate.houseArea = req.body.houseArea
                                        } else {
                                            return Messages.Failed.CASES.HOUSE_AREA
                                        }
                                        if (req.body.resiInterior && ["VERY_GOOD", "GOOD", "AVERAGE", "POOR"].includes(req.body.resiInterior.toUpperCase())) {
                                            objectToBeUpdate.resiInterior = req.body.resiInterior.toUpperCase()
                                        } else {
                                            return Messages.Failed.CASES.RESI_INT
                                        }
                                        if (req.body.resiExterior && ["VERY_GOOD", "GOOD", "AVERAGE", "POOR"].includes(req.body.resiExterior.toUpperCase())) {
                                            objectToBeUpdate.resiExterior = req.body.resiExterior.toUpperCase()
                                        } else {
                                            return Messages.Failed.CASES.RESI_EXT
                                        }
                                        if (req.body.vehicle && ["YES", "NO"].includes(req.body.vehicle.toUpperCase())) {
                                            objectToBeUpdate.vehicle = req.body.vehicle.toUpperCase()
                                            if (req.body.vehicle.toUpperCase() == "YES") {
                                                if (req.body.vehicleRemarks) {
                                                    objectToBeUpdate.vehicleRemarks = req.body.vehicleRemarks.toUpperCase()
                                                } else {
                                                    return Messages.Failed.CASES.VEHICLE_REMARKS
                                                }
                                            }
                                        } else {
                                            return Messages.Failed.CASES.VEHICLE
                                        }
                                        if (req.body.premisesResidence && ["RENTED", "LEASE", "BUSINESS_CENTRE", "LOAN", "SELF_OWNED", "SHARED", "OTHER", "PARENTAL", "COMPANY_OWNED"].includes(req.body.premisesResidence.toUpperCase())) {
                                            objectToBeUpdate.premisesResidence = req.body.premisesResidence.toUpperCase()
                                            if (req.body.premisesResidence.toUpperCase() == "OTHER" || req.body.premisesResidence.toUpperCase() == "RENTED") {
                                                if (req.body.premisesResidenceRemarks) {
                                                    objectToBeUpdate.premisesResidenceRemarks = req.body.premisesResidenceRemarks
                                                } else {
                                                    return Messages.Failed.CASES.PREMISES_RESIDENCE_REMARKS
                                                }
                                            }
                                        } else {
                                            return Messages.Failed.CASES.PREMISES_RESIDENCE
                                        }
                                    }
                                } else {
                                    if (req.body.applicantDesignation) {
                                        if (["COLLEAGUE", "OFFICE_OWNER", "MANAGER", "ACCOUNTANT", "HR", "GUARD", "PARTNER", "DIRECTOR", "STAFF", "OTHER"].includes(req.body.applicantDesignation.toUpperCase())) {
                                            objectToBeUpdate.applicantDesignation = req.body.applicantDesignation.toUpperCase()
                                            if (req.body.applicantDesignation.toUpperCase() == "OTHER") {
                                                if (req.body.applicantDesignationRemarks) {
                                                    objectToBeUpdate.applicantDesignationRemarks = req.body.applicantDesignationRemarks
                                                } else {
                                                    return Messages.Failed.CASES.APPLICANT_DESIGNATION_REMARKS
                                                }
                                            } else {
                                                objectToBeUpdate.applicantDesignationRemarks = ""
                                            }
                                        } else {
                                            return Messages.Failed.CASES.APPLICANT_DESIGNATION
                                        }

                                    }
                                    if (req.body.houseCondition && ["PROPER", "TEMPORARY"].includes(req.body.houseCondition.toUpperCase())) {
                                        objectToBeUpdate.houseCondition = req.body.houseCondition.toUpperCase()
                                    } else {
                                        return Messages.Failed.CASES.HOUSE_CONDITION
                                    }
                                    if (req.body.applicantAge) {
                                        objectToBeUpdate.applicantAge = req.body.applicantAge
                                    } else {
                                        return Messages.Failed.CASES.APPLICANT_AGE
                                    }
                                    if (req.body.contactedPersonName) {
                                        objectToBeUpdate.contactedPersonName = req.body.contactedPersonName.toUpperCase()
                                    } else {
                                        return Messages.Failed.CASES.CONTACTED_PERSON_NAME
                                    }
                                    if (req.body.contactedPersonDesignation && ["FATHER", "MOTHER", "HUSBAND", "WIFE", "BROTHER", "SISTER", "SON", "DAUGHTER", "OTHER", "SELF"].includes(req.body.contactedPersonDesignation.toUpperCase())) {
                                        objectToBeUpdate.contactedPersonDesignation = req.body.contactedPersonDesignation.toUpperCase()
                                        if (req.body.contactedPersonDesignation.toUpperCase() == "OTHER") {
                                            if (req.body.contactedPersonDesignationRemarks) {
                                                objectToBeUpdate.contactedPersonDesignationRemarks =
                                                    req.body.contactedPersonDesignationRemarks;
                                            } else {
                                                return Messages.Failed.CASES.CONTACTED_PERSON_DESIGNATION;
                                            }
                                        }
                                    } else {
                                        return Messages.Failed.CASES.CONTACTED_RELATION
                                    }
                                    if (req.body.applicantOccupation) {
                                        if (["SALARIED", "SELF_EMPLOYED"].includes(req.body.applicantOccupation.toUpperCase())) {
                                            objectToBeUpdate.applicantOccupation = req.body.applicantOccupation.toUpperCase()
                                        } else {
                                            return Messages.Failed.CASES.APPLICANT_OCCUPATION
                                        }
                                    }

                                    if (req.body.workingFrom && ["LESS_THAN_1_YEAR", "1_TO_2_YEARS", "2_TO_5_YEARS", "5_TO_10_YEARS", "10_&_ABOVE_YEARS", "SINCE_BIRTH"].includes(req.body.workingFrom.toUpperCase())) {
                                        objectToBeUpdate.workingFrom = req.body.workingFrom.toUpperCase()
                                    } else {
                                        return Messages.Failed.CASES.WORKING_FROM
                                    }
                                    if (req.body.businessBoard && ["YES", "NO", "MISMATCH", "TEMPORARY"].includes(req.body.businessBoard.toUpperCase())) {
                                        objectToBeUpdate.businessBoard = req.body.businessBoard.toUpperCase();
                                        if (req.body.businessBoard.toUpperCase() == "YES") {
                                            if (req.body.businessBoardNameConfirmation && ["YES", "NO"].includes(req.body.businessBoardNameConfirmation.toUpperCase())) {
                                                objectToBeUpdate.businessBoardNameConfirmation = req.body.businessBoardNameConfirmation.toUpperCase()
                                                if (req.body.businessBoardNameConfirmation.toUpperCase() == "NO") {
                                                    if (req.body.businessBoardNameRemarks) {
                                                        objectToBeUpdate.businessBoardNameRemarks = req.body.businessBoardNameRemarks.toUpperCase()
                                                    } else {
                                                        return Messages.Failed.CASES.BUSINESS_BOARD_NAME_REMARKS
                                                    }
                                                } else {
                                                    objectToBeUpdate.businessBoardNameRemarks = ""
                                                }
                                            } else {
                                                return Messages.Failed.CASES.BUSINESS_BOARD_NAME_CONFIRMATION
                                            }
                                        } else {
                                            objectToBeUpdate.businessBoardNameConfirmation = ""
                                            if ((req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") && (!req.body.businessBoardSpecify)) {
                                                return Messages.Failed.CASES.BUSINESS_BOARD_SPECIFY
                                            } else if (req.body.businessBoard.toUpperCase() === "MISMATCH" || req.body.businessBoard.toUpperCase() === "TEMPORARY") {
                                                objectToBeUpdate.businessBoardSpecify = req.body.businessBoardSpecify
                                            }
                                        }
                                    } else {
                                        return Messages.Failed.CASES.BUSINESS_BOARD
                                    }
                                    if (req.body.totalIncome) {
                                        objectToBeUpdate.totalIncome = req.body.totalIncome
                                    } else {
                                        return Messages.Failed.CASES.TOTAL_INCOME
                                    }
                                    if (req.body.negativeProfile && ["YES", "NO"].includes(req.body.negativeProfile.toUpperCase())) {
                                        objectToBeUpdate.negativeProfile = req.body.negativeProfile.toUpperCase();
                                        if (req.body.negativeProfile.toUpperCase() == "YES") {
                                            if (req.body.negativeProfileRemarks) {
                                                objectToBeUpdate.negativeProfileRemarks = req.body.negativeProfileRemarks.toUpperCase();
                                            } else {
                                                return Messages.Failed.CASES.NEGATIVE_PROFILE_REMARKS
                                            }
                                        } else {
                                            objectToBeUpdate.negativeProfileRemarks = ""
                                        }
                                    } else {
                                        return Messages.Failed.CASES.NEGATIVE_PROFILE
                                    }
                                    if (req.body.maritalStatus && ["MARRIED", "UNMARRIED"].includes(req.body.maritalStatus.toUpperCase())) {
                                        objectToBeUpdate.maritalStatus = req.body.maritalStatus.toUpperCase()
                                        if (req.body.maritalStatus.toUpperCase() == "MARRIED") {
                                            if (req.body.isSpouseWorking && ["YES", "NO"].includes(req.body.isSpouseWorking.toUpperCase())) {
                                                objectToBeUpdate.isSpouseWorking = req.body.isSpouseWorking.toUpperCase()
                                                if (req.body.isSpouseWorking.toUpperCase() == "YES") {
                                                    if (req.body.spouseWorkingPlace) {
                                                        objectToBeUpdate.spouseWorkingPlace = req.body.spouseWorkingPlace
                                                    } else {
                                                        return Messages.Failed.CASES.SPOUSE_WORKING_PLACE
                                                    }
                                                    if (req.body.spouseWorkingSince && ["LESS_THAN_1_YEAR", "1_TO_2_YEARS", "2_TO_5_YEARS", "5_TO_10_YEARS", "10_&_ABOVE_YEARS"].includes(req.body.spouseWorkingSince.toUpperCase())) {
                                                        objectToBeUpdate.spouseWorkingSince = req.body.spouseWorkingSince
                                                    } else {
                                                        return Messages.Failed.CASES.SPOUSE_WORKING_SINCE
                                                    }
                                                    if (req.body.spouseSalary) {
                                                        objectToBeUpdate.spouseSalary = req.body.spouseSalary
                                                    } else {
                                                        return Messages.Failed.CASES.SPOUSE_SALARY
                                                    }
                                                }
                                            } else {
                                                return Messages.Failed.CASES.SPOUSE_WORKING_STATUS
                                            }
                                        }
                                    } else {
                                        return Messages.Failed.CASES.MARITIAL_STATUS
                                    }
                                    if (req.body.noOfFMember) {
                                        objectToBeUpdate.noOfFMember = req.body.noOfFMember
                                    } else {
                                        return Messages.Failed.CASES.NO_F_FMEMBER
                                    }
                                    if (req.body.noEarningMember && parseInt(req.body.noOfFMember) >= parseInt(req.body.noEarningMember)) {
                                        objectToBeUpdate.noEarningMember = req.body.noEarningMember
                                    } else {
                                        return Messages.Failed.CASES.EARNING_MEMBER
                                    }
                                    if (req.body.locationOfResi && ["RESIDENTIAL", "COMMERCIAL", "SEMI_COMMERCIAL", "INDUSTRIAL", "RURAL", "COMMUNITY_DOMINATED"].includes(req.body.locationOfResi.toUpperCase())) {
                                        objectToBeUpdate.locationOfResi = req.body.locationOfResi.toUpperCase()
                                    } else {
                                        return Messages.Failed.CASES.LOCATION_OF_RESI
                                    }
                                    if (req.body.typeOfResi && ["INDEPENDENT_HOUSE", "CHAWL", "FLAT", "BUNGALOW", "RAW_HOUSE", "TEMPORARY_HOUSE", "OTHER"].includes(req.body.typeOfResi.toUpperCase())) {
                                        objectToBeUpdate.typeOfResi = req.body.typeOfResi.toUpperCase()
                                        if (req.body.typeOfResi.toUpperCase() == "OTHER") {
                                            if (req.body.typeOfResiRemarks) {
                                                objectToBeUpdate.typeOfResiRemarks = req.body.typeOfResiRemarks
                                            } else {
                                                return Messages.Failed.CASES.RESI_REMARKS
                                            }
                                        }
                                    } else {
                                        return Messages.Failed.CASES.TYPE_OF_RESI
                                    }
                                    if (req.body.areaLocality && ["UPPER_MIDDLE_CLASS", "MIDDLE_CLASS", "LOWER_MIDDLE_CLASS", "NEGATIVE"].includes(req.body.areaLocality.toUpperCase())) {
                                        objectToBeUpdate.areaLocality = req.body.areaLocality.toUpperCase()
                                    } else {
                                        return Messages.Failed.CASES.AREA_LOCALITY
                                    }
                                    if (req.body.houseArea) {
                                        objectToBeUpdate.houseArea = req.body.houseArea
                                    } else {
                                        return Messages.Failed.CASES.HOUSE_AREA
                                    }
                                    if (req.body.resiInterior && ["VERY_GOOD", "GOOD", "AVERAGE", "POOR"].includes(req.body.resiInterior.toUpperCase())) {
                                        objectToBeUpdate.resiInterior = req.body.resiInterior.toUpperCase()
                                    } else {
                                        return Messages.Failed.CASES.RESI_INT
                                    }
                                    if (req.body.resiExterior && ["VERY_GOOD", "GOOD", "AVERAGE", "POOR"].includes(req.body.resiExterior.toUpperCase())) {
                                        objectToBeUpdate.resiExterior = req.body.resiExterior.toUpperCase()
                                    } else {
                                        return Messages.Failed.CASES.RESI_EXT
                                    }
                                    if (req.body.vehicle && ["YES", "NO"].includes(req.body.vehicle.toUpperCase())) {
                                        objectToBeUpdate.vehicle = req.body.vehicle.toUpperCase()
                                        if (req.body.vehicle.toUpperCase() == "YES") {
                                            if (req.body.vehicleRemarks) {
                                                objectToBeUpdate.vehicleRemarks = req.body.vehicleRemarks.toUpperCase()
                                            } else {
                                                return Messages.Failed.CASES.VEHICLE_REMARKS
                                            }
                                        }
                                    } else {
                                        return Messages.Failed.CASES.VEHICLE
                                    }
                                    if (req.body.premisesResidence && ["RENTED", "LEASE", "BUSINESS_CENTRE", "LOAN", "SELF_OWNED", "SHARED", "OTHER", "PARENTAL", "COMPANY_OWNED"].includes(req.body.premisesResidence.toUpperCase())) {
                                        objectToBeUpdate.premisesResidence = req.body.premisesResidence.toUpperCase()
                                        if (req.body.premisesResidence.toUpperCase() == "OTHER" || req.body.premisesResidence.toUpperCase() == "RENTED") {
                                            if (req.body.premisesResidenceRemarks) {
                                                objectToBeUpdate.premisesResidenceRemarks = req.body.premisesResidenceRemarks
                                            } else {
                                                return Messages.Failed.CASES.PREMISES_RESIDENCE_REMARKS
                                            }
                                        }
                                    } else {
                                        return Messages.Failed.CASES.PREMISES_RESIDENCE
                                    }
                                }

                            }
                        } else {
                            return Messages.Failed.CASES.OFFICE_LOCK
                        }
                    } else if (req.body.addressConfirm.toUpperCase() == "NO") {
                        objectToBeUpdate.cordinates = ""
                        objectToBeUpdate.addressConfirmByFieldExecutive = ""
                        objectToBeUpdate.addressConfirmByFieldExecutiveRemarks = ""
                        objectToBeUpdate.contactedPersonName = ""
                        objectToBeUpdate.contactedPersonDesignation = ""
                        objectToBeUpdate.contactedPersonDesignationRemarks = ""
                        objectToBeUpdate.applicantOccupation = ""
                        objectToBeUpdate.workingFrom = ""
                        objectToBeUpdate.maritalStatus = ""
                        objectToBeUpdate.isSpouseWorking = ""
                        objectToBeUpdate.spouseWorkingPlace = ""
                        objectToBeUpdate.spouseWorkingSince = ""
                        objectToBeUpdate.spouseSalary = ""
                        objectToBeUpdate.noOfFMember = ""
                        objectToBeUpdate.noEarningMember = ""
                        objectToBeUpdate.premisesResidence = ""
                        objectToBeUpdate.premisesResidenceRemarks = ""
                        objectToBeUpdate.locationOfResi = ""
                        objectToBeUpdate.typeOfResi = ""
                        objectToBeUpdate.typeOfResiRemarks = ""
                        objectToBeUpdate.areaLocality = ""
                        objectToBeUpdate.houseArea = ""
                        objectToBeUpdate.resiInterior = ""
                        objectToBeUpdate.resiExterior = ""
                        objectToBeUpdate.houseCondition = ""
                        objectToBeUpdate.vehicle = ""
                        objectToBeUpdate.vehicleRemarks = ""
                        objectToBeUpdate.businessBoard = ""
                        objectToBeUpdate.businessBoardNameConfirmation = ""
                        objectToBeUpdate.businessBoardNameRemarks = ""
                        objectToBeUpdate.businessBoardSpecify = ""
                        objectToBeUpdate.totalIncome = ""
                        objectToBeUpdate.negativeProfile = ""
                        objectToBeUpdate.negativeProfileRemarks = ""
                        objectToBeUpdate.officeLocked = ""
                        objectToBeUpdate.applicantStayAddressConfirm = ""
                        objectToBeUpdate.applicantDesignation = ""
                        objectToBeUpdate.applicantDesignationRemarks = ""
                        objectToBeUpdate.applicantAge = ""
                        objectToBeUpdate.entryAllowed = ""
                    } else {
                        return Messages.Failed.CASES.ADDRESS_CONFIRMATION_REQUIRED
                    }
                } else {
                    return Messages.Failed.CASES.ADDRESS_CONFIRMATION_REQUIRED
                }
            }
            if (req.user.role != "field-executive") {
                if (req.files) {
                    if (req.files.imageFile1) {

                        filePath[0] = req.files.imageFile1[0].key;
                        // x.addWaterMark(filePath[0], req.body)
                    } else {
                        if (req.body.duplicateImageFile1) {
                            filePath[0] = req.body.duplicateImageFile1
                        }
                    }
                    if (req.files.imageFile2) {


                        filePath[1] = req.files.imageFile2[0].key
                        // x.addWaterMark(filePath[1], req.body)
                    } else {
                        if (req.body.duplicateImageFile2) {


                            filePath[1] = req.body.duplicateImageFile2
                        }
                    }
                    if (req.files.imageFile3) {


                        filePath[2] = req.files.imageFile3[0].key
                        // x.addWaterMark(filePath[2], req.body)
                    } else {
                        if (req.body.duplicateImageFile3) {
                            filePath[2] = req.body.duplicateImageFile3
                        }
                    }
                    if (req.files.imageFile4) {

                        filePath[3] = req.files.imageFile4[0].key
                        // x.addWaterMark(filePath[3], req.body)
                    } else {
                        if (req.body.duplicateImageFile4) {
                            filePath[3] = req.body.duplicateImageFile4
                        }
                    }
                    if (req.files.imageFile5) {

                        filePath[4] = req.files.imageFile5[0].key
                        // x.addWaterMark(filePath[3], req.body)
                    } else {
                        if (req.body.duplicateImageFile5) {
                            filePath[4] = req.body.duplicateImageFile5
                        }
                    }
                    if (req.files.imageFile6) {

                        filePath[5] = req.files.imageFile6[0].key
                        // x.addWaterMark(filePath[3], req.body)
                    } else {
                        if (req.body.duplicateImageFile6) {
                            filePath[5] = req.body.duplicateImageFile6
                        }
                    }
                    if (req.files.imageFile7) {

                        filePath[6] = req.files.imageFile7[0].key
                        // x.addWaterMark(filePath[3], req.body)
                    } else {
                        if (req.body.duplicateImageFile7) {
                            filePath[6] = req.body.duplicateImageFile7
                        }
                    }
                    if (req.files.imageFile8) {

                        filePath[7] = req.files.imageFile8[0].key
                        // x.addWaterMark(filePath[3], req.body)
                    } else {
                        if (req.body.duplicateImageFile8) {
                            filePath[7] = req.body.duplicateImageFile8
                        }
                    }
                    objectToBeUpdate.documents = filePath;
                }
            }
            return objectToBeUpdate
        }
    } catch (error) {
        let msg: any = {}
        msg.code = 401;
        msg.message = error.message
        return msg
    }
}
export default validateReviewData