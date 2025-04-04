import { agFooter } from "../../helper/footer";
import { APInvoiceDetail } from "./apinvoicedetail";
import { APInvoiceSlip } from "./apinvoiceslip";

export class APInvoice {
  pivId: number;
  pivNo: string;
  pivDate: string;
  supplierId: number;
  supplierInvNo: string;
  supplierInvDate?: Date;
  amount: number;
  narration: string;
  periodId: number;
  periodName: string;
  reversedPIVNo: string;
  sourcePIVNo: string;
  hasSlip: boolean;
  slipDateFrom?: Date;
  slipDateTo?: Date;
  details: APInvoiceDetail[] = [];
  slips: APInvoiceSlip[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}

