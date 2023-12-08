export interface bankMember {
    _id: string;
    fullName: string;
    email: string;
    password?: string;
    permissions?: Array<any>;
    isDeleted?: Boolean;
    token:string;
}