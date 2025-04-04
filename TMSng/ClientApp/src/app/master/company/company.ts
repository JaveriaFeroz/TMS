import { agFooter } from "../../helper/footer";

export class Company {
    companyId:number;  
    companyName: string;
    companyAddress: string;
    ntn: string;
    distanceThreshold: number;  
    reportGraceHRs: number;  
    bankAccountId: number;  
    arAccountId: number;
    apAccountId: number;   
    tripRevenueAccountId: number;
    advanceAccountId: number;
    enableGL: boolean;
    routeByConsignee: boolean;
    enablePartialDelivery: boolean;
    separateFixedInvoice: boolean;
    fuelExpenseAccountId; number;
    isMandatoryDriver2: boolean;
    allowTrailer: boolean;
    constructor() { }
}

