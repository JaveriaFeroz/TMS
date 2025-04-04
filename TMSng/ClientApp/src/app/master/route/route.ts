import { agFooter } from "../../helper/footer";

export class Route {
    routeId:number;  
    routeName: string;
    originId: number;
    destinationId: number;
    consigneeStartPoint: number;
    consigneeFinishPoint: number;
    stdKMs: number;
    stdTT: number;
    hillyKMs: number;
    isActive: boolean;
    tollTaxApplicable: boolean;
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }
   
}

