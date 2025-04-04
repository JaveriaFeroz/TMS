import { agFooter } from "../../helper/footer";
import { SupplierRateDetail } from "./supplierratedetail";

export class SupplierRate {
    supplierId:number;     
    footer: agFooter;
    details: SupplierRateDetail[] = [];
    constructor() { this.footer = new agFooter(); }
   
}
