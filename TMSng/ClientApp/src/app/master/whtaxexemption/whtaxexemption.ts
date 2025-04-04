import { agFooter } from "../../helper/footer";

export class WHTaxExemption {
    exemptionId:number;
    dateFrom: Date;
    dateTo: Date;    
    footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
