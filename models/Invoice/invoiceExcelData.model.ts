import mongoose, { model, Schema } from "mongoose";
import { TransformStreamDefaultController } from "stream/web";



const invoiceExcelDataSchema: Schema = new Schema(
    {
        date: {
            type: String,
            trim: true,
            required: true,
        },
        time: {
            type: String,
            trim: true,
            required: true,
        },
        fileNo: {
            type: String,
            trim: true,
            required: true,
        },
        barCode: {
            type: String,
            trim: true,
        },
        applicantName: {
            type: String,
            trim: true,
            required: true,
        },
        applicantType: {
            type: String,
            trim: true,
            uppercase: true,
            required: true,
        },
        addressType: {
            type: String,
            trim: true,
            required: true,
            uppercase: true,
        },
        officeName: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
            required: true,
        },
        pinCode: {
            type: Number,
            trim: true,
        },
        branch: {
            type: String,
            trim: true,
        },
        area: {
            type: String,
            required: true,
            uppercase: true,
        },
        bank: {
            type: String,
            trim: true,
            required: true,
        },
        product: {
            type: String,
            trim: true,
            required: true,
            uppercase: true,
        },
        mobileNo: {
            type: Number,
            trim: true,
            required: true,
        },

        // ************* FIELDS ADDED WHILE CASE UPLOADING AND ASSIGNING CASES **********
        duplicate: {
            type: Boolean,
            trim: true,
            default: false,
        },
        managerId: {
            type: Schema.Types.ObjectId,
            trim: true,

        },
        seniorSupervisorId: {
            type: Schema.Types.ObjectId,
            trim: true,
        },
        supervisorId: {
            type: Schema.Types.ObjectId,
            trim: true,
        },
        fieldExecutiveId: {
            type: Schema.Types.ObjectId,
            trim: true,
        },
        logs: {
            type: Array
        },
        parentId: {
            type: Schema.Types.ObjectId,
            trim: true,
        },

        // *************** MOBILE APPLICATION FIELDS ADDED BY FIELD-EXECUTIVE *******************
        acceptedBy: {
            type: Schema.Types.ObjectId,
            trim: true,
        },
        declinedBy: {
            type: Array
        },
        stage: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            default: "open",
            trim: true,
        },
        addressConfirm: {
            type: String,
            trim: true,
            uppercase: true,

        },
        addressConfirmByFieldExecutive: {
            type: String,
            trim: true,
            uppercase: true,

        },
        addressConfirmByFieldExecutiveRemarks: {
            type: String,
        },
        easeOfLocating: {
            type: String,
            trim: true,
            uppercase: true,

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

        },
        applicantDesignation: {
            type: String,
            trim: true,

        },
        applicantDesignationRemarks: {
            type: String,
            trim: true,
        },
        workingFrom: {
            type: String,
            trim: true,
            uppercase: true,

        },
        premisesBusiness: {
            type: String,
            trim: true,

        },
        premisesBusinessRemarks: {
            type: String,
            trim: true,
        },
        areaType: {
            type: String,
            trim: true,
            uppercase: true,

        },
        // ***** business board = name plate 
        businessBoard: {
            type: String,
            trim: true,
            uppercase: true,


        },

        businessBoardSpecify: {
            type: String,
            trim: true,
        },
        // ***** business board Confirmation = name plate Confirmation
        businessBoardNameConfirmation: {
            type: String,
            trim: true,

        },
        // ***** business Board Name Remarks = name plate Name Remarks
        businessBoardNameRemarks: {
            type: String,
            trim: true,
        },
        natureOfBusiness: {
            type: String,
            trim: true,

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

        },
        stock: {
            type: String,
            trim: true,

        },
        businessActivitySeen: {
            type: String,
            trim: true,

        },
        businessActivity: {
            type: String,
            trim: true,

        },
        noOfEmployees: {
            type: Number
        },
        negativeProfile: {
            type: String,
            trim: true,

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

        },
        neighbourCheck2: {
            type: String,
            trim: true,
        },
        neighbourCheck2Remarks: {
            type: String,
            trim: true,

        },
        distance: {
            type: String,
            trim: true,
        },
        applicantStayAddress: {
            type: String,
            trim: true,
        },
        applicantStayAddressConfirm: {
            type: String,
            trim: true,

        },
        premisesResidence: {
            type: String,
            trim: true,

        },
        premisesResidenceRemarks: {
            type: String,
            trim: true,
        },
        officeSetup: {
            type: String,
            trim: true,

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
            type: mongoose.Schema.Types.Mixed,
            trim: true,
        },
        timeVisit: {
            type: String,
            trim: true,
        },
        officeLock: {
            type: String,
            trim: true,

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

        },
        caseStatus: {
            type: String,
            trim: true,

        },
        caseStatusRemarks: {
            type: String,
            trim: true,
        },
        maritalStatus: {
            type: String,
            trim: true,

        },
        isSpouseWorking: {
            type: String,
            trim: true,

        },
        spouseWorkingPlace: {
            type: String,
            trim: true,
        },
        spouseWorkingSince: {
            type: String,
            trim: true,
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

        },
        typeOfResi: {
            type: String,
            trim: true,

        },
        typeOfResiRemarks: {
            type: String,
            trim: true,
        },
        areaLocality: {
            type: String,
            trim: true,

        },
        houseArea: {
            type: Number,
            trim: true,
        },
        resiInterior: {
            type: String,
            trim: true,

        },
        resiExterior: {
            type: String, trim: true,

        },
        houseCondition: {
            type: String,
            trim: true,

        },
        vehicle: {
            type: String,
            trim: true,

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
        },
        supervisor: {
            type: Object,
        },
        manager: {
            type: Object,
        },
        seniorSupervisor: {
            type: Object,
        },
        fieldExecutive: {
            type: Object,
        },
        admin: {
            type: Object,
        },
        directSupervisor: {
            type: Boolean,
        },
        entryAllowed: {
            type: String,
        },
        esg: {
            type: Object,
            forcedLabourChildLabour: {
                type: Object,
                required: true,
                status: {
                    type: String,
                    default: 'NO',

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

            },
            reason: {
                type: String,
            }
        },
        point: {
            type: Number,
            required: true,
            enum: [0, 1, 2]
        },
        rate: {
            type: Number,
            require: true
        },
        rv: {
            type: Object,
            address: {
                type: String
            },
            remark: {
                type: String
            },
            distance: {
                type: String
            }
        },
        bv: {
            type: Object,
            address: {
                type: String
            },
            remark: {
                type: String
            },
            distance: {
                type: String
            }
        },
        pv: {
            type: Object,
            address: {
                type: String
            },
            remark: {
                type: String
            },
            distance: {
                type: String
            }
        },
        uniqueId: {
            type: String,
            require: true,
        },
        branchId: {
            type: String,
        },
        businessBranch: {
            type: String,
        },
        tat: {
            type: String,
        },
        businessHrs: {
            type: Number,
        },
        conveyance: {
            type: Object,
            distance: {
                type: Number,
            },
            cost: {
                type: Number,
            }
        },
        oglOrWithin: {
            type: String,
        }
    }
);


const invoiceExcelDataModel = model("invoiceExcelData", invoiceExcelDataSchema);

export default invoiceExcelDataModel;