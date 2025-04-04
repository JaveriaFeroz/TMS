import { agFooter } from "../../helper/footer";

export class MaintenanceCharge {
    chargeId:number;  
    chargeName: string;
    isActive:boolean; 
    footer: agFooter;
  constructor() { this.footer = new agFooter(); }
   
}


