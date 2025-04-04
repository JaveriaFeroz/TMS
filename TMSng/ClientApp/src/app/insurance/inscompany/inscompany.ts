import { agFooter } from "../../helper/footer";

export class InsCompany {
    companyId:number;  
    companyName: string; 
    isActive:boolean; 
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }
}
