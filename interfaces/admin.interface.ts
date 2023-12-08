export interface admin {
    _id: string;
    fullName: string;
    email: string;
    password?: string;
    permissions: Array<string>;
    fireBaseToken?: Array<string>;
}