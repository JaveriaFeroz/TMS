import { agFooter } from "../../helper/footer";

export class WarningType {
    typeId:number;  
    typeName: string;
    isActive:boolean; 
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }
   
}

