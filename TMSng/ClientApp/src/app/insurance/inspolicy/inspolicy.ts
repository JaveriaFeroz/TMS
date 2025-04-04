import { agFooter } from "../../helper/footer";
import { InsPolicyAsset } from './inspolicyasset';

export class InsPolicy{
    policyId:number;  
    policyNo: string; 
    fromDate: Date;
    toDate: Date
    insCompanyId:number;
    isActive: boolean;
    companyid: number;
    assets: InsPolicyAsset[]=[] ;
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }  
}
