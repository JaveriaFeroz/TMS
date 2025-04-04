import { agFooter } from "../../helper/footer";

export class RouteGroup {
    groupId:number;  
    groupName: string;
    isActive:boolean; 
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }
   
}

