/**
 * @description API Response messeges
 * @author [Archit sharma]
 */
const Messages: any = {

    SUCCESS: {
        MOBILE_LOGGED_IN: {
            status: true,
            message: "User Successfully Logged In",
            code: 200,
            data: {
                user: {
                    token: "",
                    _id: "",
                    fullName: ""
                }
            }
        },
        MOBILE_ASSIGN_CASES: {
            status: true,
            message: "My Assigned Cases",
            code: 200,
            data: {
                totalCases: "",
                currentPage: "",
                limit: "",
                cases: [],
            }
        },
        MOBILE_ACCEPTED_CASES: {
            status: true,
            message: "My Accepted Cases",
            code: 200,
            data: {
                totalCases: "",
                currentPage: "",
                limit: "",
                cases: [],
            }
        },
        MOBILE_ACCEPT_CASE: {
            status: true,
            message: "Case Accepted Successfully, Now Available in Accepted Cases Section",
            code: 200,
        },
        MOBILE_REJECT_CASE: {
            status: true,
            message: "Case Declined Successfully",
            code: 200,
        },
        MOBILE_LOGOUT: {
            status: true,
            message: "Logged out Successfully",
            code: 200,
        },
        MOBILE_SUBMITED_CASES: {
            status: true,
            message: "Submitted Cases",
            code: 200,
            data: {
                totalCases: "",
                currentPage: "",
                limit: "",
                cases: [],
            }
        },
        LOGGED_IN: {
            status: true,
            message: "USER LOGGED IN",
            code: 200,
            token: "",
            _id: ""
        },
        UPDATED_SUCCESSFULLY: {
            status: true,
            message: "UPDATED SUCCESSFULLY",
            code: 201
        },
        DELETED_SUCCESSFULLY: {
            status: true,
            message: "DELETED SUCCESSFULLY",
            code: 201
        },
        ADDED_SUCCESSFULLY: {
            status: true,
            message: "ADDED SUCCESSFULLY",
            code: 201
        },
        CASES: {
            AREA_PRODUCT_BANK_EXISTS: {
                status: true,
                message: "AREA OR BANK OR PRODUCT ALREADY EXISTS",
                code: 201
            },
            STARTING_CORDINATES: {
                status: true,
                message: "DAY START SUCCESSFULLY ",
                code: 201
            },
            ENDING_CORDINATES: {
                status: true,
                message: "DAY END SUCCESSFULLY ",
                code: 201
            },
            CASE_UPLOADED: {
                status: true,
                message: "UPLOADED SUCCESSFULLY",
                code: 201
            },
            CASE_SUBMITED: {
                status: true,
                message: "SUBMITED SUCCESSFULLY",
                code: 201
            }
        }
    },

    Failed: {
        DAY_ON_OFF: {
            status: false,
            code: 401,
            message: "Day is already on first off your previous session using mobile application"
        },
        DAY_OFF: {
            status: false,
            code: 401,
            message: "Day is already off, Start the Day first"
        },
        PERMISSION_DENIED: {
            status: false,
            code: 401,
            message: "Permission denied"
        },
        EMAIL_PASSWORD_MISSING: {
            status: false,
            code: 401,
            message: "email or password missing"
        },
        INVALID_ROLE: {
            status: false,
            message: "Invalid role",
            code: 401
        },
        INVALID_PASSWORD: {
            status: false,
            message: "Invalid Password",
            code: 401
        },
        USER_NOT_REGISTERED: {
            status: false,
            message: "Not Registered By admin",
            code: 401
        },
        INVALID_EMAIL_ID: {
            status: false,
            message: "Invalid Email",
            code: 401
        },
        EMAIL_ID_ALREADY_EXISTS: {
            status: false,
            message: "Email Already in use",
            code: 401
        },
        INVALID_PERMISSIONS_GRANTED: {
            status: false,
            message: "Invalid Permission",
            code: 401
        },
        SOMETHING_WENT_WRONG: {
            status: false,
            message: "Something Went Wrong",
            code: 401
        },
        DUPLICATE_FILE: {
            status: false,
            message: "Duplicate File",
            code: 401
        },
        EMPTY_EXCEL_UPLOADED: {
            status: false,
            message: "Empty Excel File",
            code: 401
        },
        MANAGER_ALREADY_EXISTS: {
            status: false,
            message: "Manager for that Area and Product Already Exists",
            code: 401
        },
        SENIOR_SUPERVISOR_ALREADY_EXISTS: {
            status: false,
            message: "Senior-Supevisor for that Area and Product Already Exists",
            code: 401
        },
        SUPERVISOR_ALREADY_EXISTS: {
            status: false,
            message: "Supevisor for that Area and Product Already Exists",
            code: 401
        },
        MANAGER_NOT_ASSIGNED: {
            status: false,
            message: "",
            code: 401
        },
        DUPLICATE_AREA_PRODUCT_BANK: {
            status: false,
            message: "Duplicate Area or Product or Bank Selected",
            code: 401
        },
        EDIT_FAILED: {
            status: false,
            message: "Access Denied as this member cases are still in pending state ",
            code: 401
        },
        MOBILE_SUBMITED_CASE_DATE: {
            status: false,
            message: "Date should be in between 90 days from today",
            code: 401
        },
        PASSWORD_REQUIRED: {
            status: false,
            message: "Password required when activating the user",
            code: 401
        },
        CASES: {
            IMAGE_STATUS_REQ: {
                status: false,
                message: "Image allowed status is required",
                code: 401
            },
            IMAGE_STATUS_REM_REQ: {
                status: false,
                message: "Image not allowed reason required",
                code: 401
            },
            ESG_MISSING: {
                status: false,
                message: "All esg fields are required",
                code: 401
            },
            BUSINESS_BOARD_SPECIFY: {
                status: false,
                message: "Board specification is missing",
                code: 401
            },
            MANAGER_NOT_FOUND: {
                status: false,
                message: "Manager not found due to some internal error or invalid id ",
                code: 401
            },
            MANAGER_FIELDS_MISSING: {
                status: false,
                message: "This manager dont have the required area,product or bank",
                code: 401
            },
            SENIOR_SUPERVISOR_FIELDS_MISSING: {
                status: false,
                message: "This Senior supervisor dont have the required area,product or bank",
                code: 401
            },
            SENIOR_SUPERVISOR_NOT_FOUND: {
                status: false,
                message: "Senior Supervisor not found due to some internal error or invalid id ",
                code: 401
            },
            SUPERVISOR_FIELDS_MISSING: {
                status: false,
                message: "This supervisor dont have the required area,product or bank",
                code: 401
            },
            SUPERVISOR_NOT_FOUND: {
                status: false,
                message: "Supervisor not found due to some internal error or invalid id ",
                code: 401
            },
            STARTING_CORDINATES: {
                status: false,
                message: "ERROR, CORDINATES CANT BE UPLOADED",
                code: 401
            },
            AREA_PRODUCT_BANK_MISSING: {
                status: false,
                message: "AREA OR PRODUCT OR BANK Dont exists",
                code: 401
            },
            ADDRESS_FIELD_REQUIRED: {
                status: false,
                message: "ADDRESS REMARKS REQUIRED IF ADDRESS IS NOT SAME",
                code: 401
            },
            ADDRESS_FIELD_BY_FIELDEXECUTIVE: {
                status: false,
                message: "ADDRESS same or not same required",
                code: 401
            },
            ADDRESS_CONFIRMATION_REQUIRED: {
                status: false,
                message: "ADDRESS CONFIRMATION REQUIRED",
                code: 401
            },
            CONTACTED_PERSON_NAME: {
                status: false,
                message: "CONTACTED PERSON NAME REQUIRED",
                code: 401
            },
            CONTACTED_PERSON_DESIGNATION: {
                status: false,
                message: "CONTACTED PERSON DESIGNATION REQUIRED",
                code: 401
            },
            CONTACTED_PERSON_DESIGNATION_REMARKS: {
                status: false,
                message: "CONTACTED PERSON DESIGNATION REMARKS REQUIRED",
                code: 401
            },

            APPLICANT_OCCUPATION: {
                status: false,
                message: "APPLICANT OCCUPATION REQUIRED",
                code: 401
            },
            WORKING_FROM: {
                status: false,
                message: "WORKING FROM REQUIRED",
                code: 401
            },
            PREMISES_BUSINESS: {
                status: false,
                message: "PREMISES FOR BUSINESS REQUIRED",
                code: 401
            },
            PREMISES_BUSINESS_REMARKS: {
                status: false,
                message: "PREMISES BUSINESS DETAILS REQUIRED",
                code: 401
            },

            AREA_TYPE: {
                status: false,
                message: "AREA TYPE REQUIRED",
                code: 401
            },
            BUSINESS_BOARD: {
                status: false,
                message: "BUSINESS BOARD REQUIRED",
                code: 401
            },
            BUSINESS_BOARD_NAME_REMARKS: {
                status: false,
                message: "BUSINESS BOARD REMARKS REQUIRED",
                code: 401
            },
            BUSINESS_BOARD_NAME_CONFIRMATION: {
                status: false,
                message: "BUSINESS BOARD NAME REQUIRED",
                code: 401
            },
            NATURE_OF_BUSINESS_REMARKS: {
                status: false,
                message: "NATURE OF BUSINESS REMARKS REQUIRED",
                code: 401
            },
            NATURE_OF_BUSINESS: {
                status: false,
                message: "NATURE OF BUSINESS REQUIRED",
                code: 401
            },
            TOTAL_INCOME: {
                status: false,
                message: "TOTAL INCOME REQUIRED",
                code: 401
            },
            STOCK: {
                status: false,
                message: "STOCK VALUE REQUIRED",
                code: 401
            },
            STOCK_SEEN: {
                status: false,
                message: "STOCK CONFIRMATION VALUE REQUIRED",
                code: 401
            },
            BUSINESS_ACTIVITY_SEEN: {
                status: false,
                message: "BUSINESS ACTIVITY SEEN VALUE REQUIRED",
                code: 401
            },
            BUSINESS_ACTIVITY: {
                status: false,
                message: "BUSINESS ACTIVITY VOLUME REQUIRED",
                code: 401
            },
            NO_OF_EMPOLOYEES: {
                status: false,
                message: "NO OF EMPLOYEES REQUIRED",
                code: 401
            },
            NEGATIVE_PROFILE_REMARKS: {
                status: false,
                message: "NEGATIVE PROFILE REMARKS REQUIRED",
                code: 401
            },
            NEGATIVE_PROFILE: {
                status: false,
                message: "NEGATIVE PROFILE CONFIRMATION REQUIRED",
                code: 401
            },
            NEIGHBOUR_CHECK: {
                status: false,
                message: "NEIGHBOUR CHECK REQUIRED",
                code: 401
            },
            DISTANCE: {
                status: false,
                message: "DISTANCE REQUIRED",
                code: 401
            },
            APPLICANT_STAY_ADDRESS: {
                status: false,
                message: "APPLICANT STAY ADDRESS REQUIRED",
                code: 401
            },
            PREMISES_RESIDENCE: {
                status: false,
                message: "Residence PREMISES REQUIRED",
                code: 401
            },
            PREMISES_RESIDENCE_REMARKS: {
                status: false,
                message: "Residence PREMISES REMARKS REQUIRED",
                code: 401
            },
            STAY_SAME_ADDRESS: {
                status: false,
                message: "STAY ON THE ADDRESS REQUIRED",
                code: 401
            },
            DOCUMENTS_UPLOADED: {
                status: false,
                message: "DOCUMENTS REQUIRED",
                code: 401
            },
            CASE_DATA_EMPTY: {
                status: false,
                message: "CASE DATA EMPTY",
                code: 401
            },
            LANDMARK: {
                status: false,
                message: "Landmark required ",
                code: 401
            },
            EASEOFLOCATING: {
                status: false,
                message: "Ease of locating required ",
                code: 401
            },
            OFFICE_LOCK: {
                status: false,
                message: "Office Lock required ",
                code: 401
            },
            APPLICANT_AGE: {
                status: false,
                message: "Applicant age required",
                code: 401
            },
            OFFICE_SETUP: {
                status: false,
                message: "Office setup required",
                code: 401
            },
            APPLICANT_DESIGNATION: {
                status: false,
                message: "Applicant designation required",
                code: 401
            },
            APPLICANT_DESIGNATION_REMARKS: {
                status: false,
                message: "Applicant designation remarks required",
                code: 401
            },
            APPLICANT_STAY_ADDRESS_CONFIRM: {
                status: false,
                message: "APPLICANT STAY ADDRESS CONFIRMATION REQUIRED",
                code: 401
            },
            AGENCY_NAME: {
                status: false,
                message: "AGENCY NAME REQUIRED",
                code: 401
            },
            CASE_STATUS: {
                status: false,
                message: "CASE STATUS REQUIRED",
                code: 401
            },
            CASE_NOT_FOUND: {
                status: false,
                message: "CASE NOT FOUND OR SOME INTERNAL ERROR AS DATA IN CASE DID NOT UPDATED",
                code: 401
            },
            FE_NOT_FOUND: {
                status: false,
                message: "FE NOT FOUND OR SOME INTERNAL ERROR AS DATA IN FIELD EXECUTIVE DID NOT UPDATED ",
                code: 401
            },
            DAY_ON_OFF_SUBMIT: {
                status: false,
                message: "FIRST ON THE DAY THEN SUBMIT CASE",
                code: 401
            },
            IMPROPER_DATA: {
                status: false,
                message: "",
                code: 401
            },
            HOUSE_CONDITION: {
                status: false,
                message: "House condition required",
                code: 401
            },
            CONTACTED_RELATION: {
                status: false,
                message: "Contacted person relation required",
                code: 401
            },
            MARITIAL_STATUS: {
                status: false,
                message: "Maritial status required",
                code: 401
            },
            SPOUSE_WORKING_STATUS: {
                status: false,
                message: "Spouse working  status required",
                code: 401
            },
            SPOUSE_WORKING_PLACE: {
                status: false,
                message: "Spouse working place required",
                code: 401
            },
            SPOUSE_WORKING_SINCE: {
                status: false,
                message: "Spouse working since required",
                code: 401
            },
            SPOUSE_SALARY: {
                status: false,
                message: "Spouse salary required",
                code: 401
            },
            NO_F_FMEMBER: {
                status: false,
                message: "Family member required",
                code: 401
            },
            EARNING_MEMBER: {
                status: false,
                message: "Earning member required or earning member must be less than family member",
                code: 401
            },
            LOCATION_OF_RESI: {
                status: false,
                message: "Residence location required",
                code: 401
            },
            TYPE_OF_RESI: {
                status: false,
                message: "Type of residence required",
                code: 401
            },
            RESI_REMARKS: {
                status: false,
                message: "Residence remarks required",
                code: 401
            },
            VEHICLE_REMARKS: {
                status: false,
                message: "Vehicle remarks required",
                code: 401
            },
            VEHICLE: {
                status: false,
                message: "Vehicle  required",
                code: 401
            },

            RESI_EXT: {
                status: false,
                message: "Residence exterior required",
                code: 401
            },
            RESI_INT: {
                status: false,
                message: "Residence interior  required",
                code: 401
            },
            HOUSE_AREA: {
                status: false,
                message: "House area  required",
                code: 401
            },
            AREA_LOCALITY: {
                status: false,
                message: "Area locality  required",
                code: 401
            },
            CORDINATES: {
                status: false,
                message: "Cordinated  required",
                code: 401
            },
            CASE_STATUS_REMARKS: {
                status: false,
                message: "Case status remarks required",
                code: 401
            },
            ADDRESS_TYPE_NOT_MATCH: {
                status: false,
                message: "Address type of both cases are different",
                code: 401
            },
            REASON: {
                status: false,
                message: "Rejected reason required",
                code: 401
            },
            MULTI_FE_ASSIGN: {
                status: false,
                message: "some cannot cannot be assigned to field-executive due to some internal error ",
                code: 401
            },
            SUPER_NOT_ASSIGNED: {
                status: false,
                message: "First assign the supervisor to the case to transfer",
                code: 401
            },
            GOOGLE_API: {
                status: false,
                message: "Google api response is invalid",
                code: 401
            }

        }
    }

}

export default Messages