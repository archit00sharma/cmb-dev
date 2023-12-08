export interface manager {
    _id: string;
    fullName: string;
    email: string;
    password?: string;
    managerFields: Array<any>;
    permissions?: Array<any>;
    case?: Array<any>;
    addedBy?: String;
    isDeleted?: Boolean;
    fireBaseToken?: Array<string>;
}