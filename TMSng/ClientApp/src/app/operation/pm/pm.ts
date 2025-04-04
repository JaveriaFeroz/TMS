import { agFooter } from "../../helper/footer";
export class PM {
    pmId:number;
    capacityId :number;
    assetMakeId:number;
    activityId:number;
    dueKMs:number;
    alertKMs:number;
    isActive:boolean; 
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }   
}
