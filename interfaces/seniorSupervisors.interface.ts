export interface SeniorSupervisorFields {
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
  
  export interface seniorSupervisor {
    fullName: string;
    email: string;
    password: string;
    seniorSupervisorFields: SeniorSupervisorFields[];
    permissions: string[];
    case: string[];
    addedBy: string;
    isDeleted?: boolean;
    fireBaseToken?: string[];
    token?: string;
  }
  
  
  
  
  
  
  
  