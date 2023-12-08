import mongoose, { model, Schema, Document } from "mongoose";
import { caseManagement } from "../interfaces/case.interface";



export const caseSchema: Schema = new Schema(
    {
        // *********** EXCEL SHEET DATA FIELDS  ******************
        date: {
            type: String,
            trim: true,
            required: true,
            index: true
        },
        time: {
            type: String,
            trim: true,
            required: true,
            index: true
        },
        fileNo: {
            type: String,
            trim: true,
            required: true,
            index: true
        },
        barCode: {
            type: String,
            trim: true,
            index: true
        },
        applicantName: {
            type: String,
            trim: true,
            required: true,
            index: true
        },
        applicantType: {
            type: String,
            trim: true,
            uppercase: true,
            required: true,
            index: true
        },
        addressType: {
            type: String,
            trim: true,
            required: true,
            uppercase: true,
            enum: ["RV", "BV", "PV"],
            index: true
        },
        officeName: {
            type: String,
            trim: true,
            index: true
        },
        address: {
            type: String,
            trim: true,
            required: true,
            index: true
        },
        pinCode: {
            type: Number,
            trim: true,
            index: true
        },
        branch: {
            type: String,
            trim: true,
            index: true
        },
        area: {
            type: String,
            required: true,
            uppercase: true,
            index: true
        },
        bank: {
            type: String,
            trim: true,
            required: true,
            index: true
        },
        product: {
            type: String,
            trim: true,
            required: true,
            uppercase: true,
            index: true
        },
        mobileNo: {
            type: Number,
            trim: true,
            required: true,
            index: true
        },

        // ************* FIELDS ADDED WHILE CASE UPLOADING AND ASSIGNING CASES **********
        duplicate: {
            type: Boolean,
            trim: true,
            default: false,
            index: true
        },
        managerId: {
            type: Schema.Types.ObjectId,
            trim: true,
            index: true,
        },
        seniorSupervisorId: {
            type: Schema.Types.ObjectId,
            trim: true,
            index: true
        },
        supervisorId: {
            type: Schema.Types.ObjectId,
            trim: true,
            index: true
        },
        fieldExecutiveId: {
            type: Schema.Types.ObjectId,
            trim: true,
            index: true
        },
        logs: {
            type: Array
        },
        parentId: {
            type: Schema.Types.ObjectId,
            trim: true,
            index: true
        },

        // *************** MOBILE APPLICATION FIELDS ADDED BY FIELD-EXECUTIVE *******************
        acceptedBy: {
            type: Schema.Types.ObjectId,
            trim: true,
            index: true
        },
        declinedBy: {
            type: Array
        },
        stage: {
            type: String,
            trim: true,
            default: "",
            index: true
        },
        status: {
            type: String,
            default: "open",
            trim: true,
            index: true
        },
        addressConfirm: {
            type: String,
            trim: true,
            uppercase: true,
            enum: ["YES", "NO"]
        },
        addressConfirmByFieldExecutive: {
            type: String,
            trim: true,
            uppercase: true,
            enum: ["SAME", "NOT_SAME"]
        },
        addressConfirmByFieldExecutiveRemarks: {
            type: String,
        },
        easeOfLocating: {
            type: String,
            trim: true,
            uppercase: true,
            enum: ["EASY", "DIFFICULT", "UNTRACEABLE"]
        },
        landMark: {
            type: String,
            trim: true,
        },
        contactedPersonName: {
            type: String,
            trim: true,
            uppercase: true,
        },
        contactedPersonDesignation: {
            type: String,
            trim: true,
            uppercase: true,
            enum: ["COLLEAGUE", "SELF", "OFFICE_OWNER", "MANAGER", "ACCOUNTANT", "HR", "GUARD", "PARTNER", "DIRECTOR", "STAFF", "OTHER", "FATHER", "MOTHER", "HUSBAND", "WIFE", "BROTHER", "SISTER", "SON", "DAUGHTER"]
        },
        contactedPersonDesignationRemarks: {
            type: String,
            trim: true,
            uppercase: true,
        },
        applicantOccupation: {
            type: String,
            trim: true,
            uppercase: true,
            enum: ["SALARIED", "SELF_EMPLOYED"]
        },
        applicantDesignation: {
            type: String,
            trim: true,
            enum: ["COLLEAGUE", "OFFICE_OWNER", "MANAGER", "ACCOUNTANT", "HR", "GUARD", "PARTNER", "DIRECTOR", "STAFF", "OTHER"]
        },
        applicantDesignationRemarks: {
            type: String,
            trim: true,
        },
        workingFrom: {
            type: String,
            trim: true,
            uppercase: true,
            enum: ["LESS_THAN_1_YEAR", "1_TO_2_YEARS", "2_TO_5_YEARS", "5_TO_10_YEARS", "10_&_ABOVE_YEARS", "SINCE_BIRTH"]
        },
        premisesBusiness: {
            type: String,
            trim: true,
            enum: ["RENTED", "LEASE", "BUSINESS_CENTRE", "LOAN", "SELF_OWNED", "SHARED", "OTHER", "COMPANY_OWNED"]
        },
        premisesBusinessRemarks: {
            type: String,
            trim: true,
        },
        areaType: {
            type: String,
            trim: true,
            uppercase: true,
            enum: ["RESIDENTIAL", "COMMERCIAL", "SEMI_COMMERCIAL", "INDUSTRIAL", "RURAL", "COMMUNITY_DOMINATED"]
        },
        // ***** business board = name plate 
        businessBoard: {
            type: String,
            trim: true,
            uppercase: true,
            enum: ["YES", "NO", "MISMATCH", "TEMPORARY"]

        },

        businessBoardSpecify: {
            type: String,
            trim: true,
        },
        // ***** business board Confirmation = name plate Confirmation
        businessBoardNameConfirmation: {
            type: String,
            trim: true,
            enum: ["YES", "NO"]
        },
        // ***** business Board Name Remarks = name plate Name Remarks
        businessBoardNameRemarks: {
            type: String,
            trim: true,
        },
        natureOfBusiness: {
            type: String,
            trim: true,
            enum: ["TRADING", "MANUFACTURING", "SERVICE", "COMMISSION_AGENT", "JOB_WORK", "OTHER"]
        },
        natureOfBusinessRemarks: {
            type: String,
            trim: true,
        },
        nOfBR2: {
            type: String,
            trim: true,
        },
        totalIncome: {
            type: Number,
            trim: true,
        },
        stockSeen: {
            type: String,
            trim: true,
            enum: ["YES", "NO"]
        },
        stock: {
            type: String,
            trim: true,
            enum: ["HIGH", "MEDIUM", "LOW"]
        },
        businessActivitySeen: {
            type: String,
            trim: true,
            enum: ["YES", "NO"]
        },
        businessActivity: {
            type: String,
            trim: true,
            enum: ["HIGH", "MEDIUM", "LOW"]
        },
        noOfEmployees: {
            type: Number
        },
        negativeProfile: {
            type: String,
            trim: true,
            enum: ["YES", "NO"]
        },
        negativeProfileRemarks: {
            type: String,
            trim: true,
        },
        neighbourCheck1: {
            type: String,
            trim: true,
        },
        neighbourCheck1Remarks: {
            type: String,
            trim: true,
            enum: ["POSITIVE", "NEGATIVE", "UNKNOWN"]
        },
        neighbourCheck2: {
            type: String,
            trim: true,
        },
        neighbourCheck2Remarks: {
            type: String,
            trim: true,
            enum: ["POSITIVE", "NEGATIVE", "UNKNOWN"]
        },
        distance: {
            type: String,
            trim: true,
            index: true
        },
        applicantStayAddress: {
            type: String,
            trim: true,
        },
        applicantStayAddressConfirm: {
            type: String,
            trim: true,
            enum: ["YES", "NO"]
        },
        premisesResidence: {
            type: String,
            trim: true,
            enum: ["RENTED", "LEASE", "BUSINESS_CENTRE", "LOAN", "SELF_OWNED", "SHARED", "OTHER", "COMPANY_OWNED", "PARENTAL"]
        },
        premisesResidenceRemarks: {
            type: String,
            trim: true,
        },
        officeSetup: {
            type: String,
            trim: true,
            enum: ["PROPER", "TEMPORARY"]
        },
        staySinceSameAddressYear: {
            type: Number,
            trim: true,
        },
        staySinceSameAddressMonth: {
            type: Number,
            trim: true,
        },
        documents: {
            type: Array,
            trim: true,
        },
        remarks: {
            type: String,
            trim: true,
        },
        dateVisit: {
            type: Date,
            trim: true,
        },
        timeVisit: {
            type: String,
            trim: true,
        },
        officeLock: {
            type: String,
            trim: true,
            enum: ["YES", "NO"]
        },
        applicantAge: {
            type: Number,
            trim: true,
        },
        lat: {
            type: String,
            trim: true,
        },
        long: {
            type: String,
            trim: true,
        },
        agencyName: {
            type: String,
            trim: true,
            enum: ["MB_MANAGEMENT", "CMB_MANAGEMENT_SOLUTION_PVT_LTD", "TIME_MANAGEMENT_SERVICES"]
        },
        caseStatus: {
            type: String,
            trim: true,
            enum: ["POSITIVE", "NEGATIVE", "REFER_TO_CREDIT"],
            index: true
        },
        caseStatusRemarks: {
            type: String,
            trim: true,
            index: true
        },
        maritalStatus: {
            type: String,
            trim: true,
            enum: ["MARRIED", "UNMARRIED"]
        },
        isSpouseWorking: {
            type: String,
            trim: true,
            enum: ["YES", "NO"]
        },
        spouseWorkingPlace: {
            type: String,
            trim: true,
        },
        spouseWorkingSince: {
            type: String,
            trim: true,
            enum: ["LESS_THAN_1_YEAR", "1_TO_2_YEARS", "2_TO_5_YEARS", "5_TO_10_YEARS", "10_&_ABOVE_YEARS"]
        },
        spouseSalary: {
            type: Number,
            trim: true,
        },
        noOfFMember: {
            type: String,
            trim: true,
        },
        noEarningMember: {
            type: String,
            trim: true,
        },
        locationOfResi: {
            type: String,
            trim: true,
            enum: ["RESIDENTIAL", "COMMERCIAL", "SEMI_COMMERCIAL", "INDUSTRIAL", "RURAL", "COMMUNITY_DOMINATED"]
        },
        typeOfResi: {
            type: String,
            trim: true,
            enum: ["INDEPENDENT_HOUSE", "CHAWL", "FLAT", "BUNGALOW", "RAW_HOUSE", "TEMPORARY_HOUSE", "OTHER"]
        },
        typeOfResiRemarks: {
            type: String,
            trim: true,
        },
        areaLocality: {
            type: String,
            trim: true,
            enum: ["UPPER_MIDDLE_CLASS", "MIDDLE_CLASS", "LOWER_MIDDLE_CLASS", "NEGATIVE"]
        },
        houseArea: {
            type: Number,
            trim: true,
        },
        resiInterior: {
            type: String,
            trim: true,
            enum: ["VERY_GOOD", "GOOD", "AVERAGE", "POOR"]
        },
        resiExterior: {
            type: String, trim: true,
            enum: ["VERY_GOOD", "GOOD", "AVERAGE", "POOR"]
        },
        houseCondition: {
            type: String,
            trim: true,
            enum: ["PROPER", "TEMPORARY"]
        },
        vehicle: {
            type: String,
            trim: true,
            enum: ["YES", "NO"]
        },
        vehicleRemarks: {
            type: String,
            trim: true,
        },
        copyStatus: {
            type: String,
        },
        caseUploaded: {
            type: {},
            trim: true,
            index: true
        },
        supervisor: {
            type: Object,
            index: true
        },
        manager: {
            type: Object,
            index: true
        },
        seniorSupervisor: {
            type: Object,
            index: true
        },
        fieldExecutive: {
            type: Object,
            index: true
        },
        admin: {
            type: Object,
            index: true
        },
        directSupervisor: {
            type: Boolean,
            index: true
        },
        entryAllowed: {
            type: String,
            enum: ["YES", "NO"]
        },
        esg: {
            type: Object,
            forcedLabourChildLabour: {
                type: Object,
                required: true,
                status: {
                    type: String,
                    default: 'NO',
                    enum: ['YES', 'NO']
                },
                specify: {
                    type: String,
                }
            },
            politicalConnection: {
                type: Object,
                required: true,
                status: {
                    type: String,
                    default: 'NO',
                    enum: ['YES', 'NO']
                },
                specify: {
                    type: String,
                }
            },
            gambling: {
                type: Object,
                required: true,
                status: {
                    type: String,
                    default: 'NO',
                    enum: ['YES', 'NO']
                },
                specify: {
                    type: String,
                }
            },
            tobaccoTrading: {
                type: Object,
                required: true,
                status: {
                    type: String,
                    default: 'NO',
                    enum: ['YES', 'NO']
                },
                specify: {
                    type: String,
                }
            },
            pornography: {
                type: Object,
                required: true,
                status: {
                    type: String,
                    default: 'NO',
                    enum: ['YES', 'NO']
                },
                specify: {
                    type: String,
                }
            },
            armsAmmunition: {
                type: Object,
                required: true,
                status: {
                    type: String,
                    default: 'NO',
                    enum: ['YES', 'NO']
                },
                specify: {
                    type: String,
                }
            },
            other: {
                type: Object,
                status: {
                    type: String,
                    default: 'NO',
                    enum: ['YES', 'NO']
                },
                specify: {
                    type: String,
                }
            }
        },
        imageAllowed: {
            type: Object,
            status: {
                type: String,
                enum: ["YES", "NO"]
            },
            reason: {
                type: String,
            }
        },
        point: {
            type: Number,
            required: true,
            enum: [0, 1, 2]
        }
    }, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
}
);
caseSchema.index({ createdAt: 1 })
caseSchema.index({ "fieldExecutive.name": 1 })
caseSchema.index({ "fieldExecutive.assignedDate": 1 })
caseSchema.index({ "fieldExecutive.acceptedDate": 1 })
caseSchema.index({ "fieldExecutive.submittedDate": 1 })
caseSchema.index({ "manager.name": 1 })
caseSchema.index({ "manager.assignedDate": 1 })
caseSchema.index({ "manager.submittedDate": 1 })
caseSchema.index({ "seniorSupervisor.name": 1 })
caseSchema.index({ "seniorSupervisor.assignedDate": 1 })
caseSchema.index({ "seniorSupervisor.submittedDate": 1 })
caseSchema.index({ "supervisor.name": 1 })
caseSchema.index({ "supervisor.assignedDate": 1 })
caseSchema.index({ "supervisor.submittedDate": 1 })
caseSchema.index({ "admin.name": 1 })
caseSchema.index({ "admin.submittedDate": 1 })
const caseModel = model<caseManagement>("Case", caseSchema);
caseSchema.set('timestamps', true);
export default caseModel;