import { agFooter } from "../../helper/footer";

export class VehicleGroup {
    groupId:number;  
    groupName: string;
    isActive:boolean; 
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }
   
}

