import { agFooter } from "../../helper/footer";

export class Consignee {
    consigneeId:number;  
    consigneeName: string;
    address: string;
    clientId: number;
    cityId: number;
    contactNo: string;
    isActive:boolean; 
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
   
}

