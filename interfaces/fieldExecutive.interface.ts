export interface fieldExecutive {
    _id: String;
    fullName: String;
    email: String;
    profilePic: String;
    mobile: Number;
    password?: string;
    aadhaarCard: Number;
    panCard: String;
    fieldExecutiveFields: Array<any>;
    case?: Array<any>;
    addedBy: String;
    cordinates?: Array<any>;
    isDeleted?: String;
    fireBaseToken?: String;
    submittedCases?: Array<any>;
    token?: String;
}