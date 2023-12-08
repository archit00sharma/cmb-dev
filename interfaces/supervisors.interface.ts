export interface SupervisorFields {
  area: {
    type: string;
    index: boolean;
    trim: boolean;
    uppercase: boolean;
  };
  bank: {
    type: string;
    index: boolean;
    trim: boolean;
    uppercase: boolean;
  };
  product: {
    type: string;
    index: boolean;
    trim: boolean;
    uppercase: boolean;
  };
}

export interface supervisor {
  fullName: string;
  email: string;
  password: string;
  supervisorFields: SupervisorFields[];
  permissions: string[];
  case: string[];
  addedBy: string;
  isDeleted?: boolean;
  fireBaseToken?: string[];
  token?: string;
}