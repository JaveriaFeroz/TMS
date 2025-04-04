import { agFooter } from "../../helper/footer";

export class AccessorialCharge {
    chargeId:number;  
    chargeName: string;
    chargeCode: string; 
    isActive:boolean; 
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }
}
