import { agFooter } from "../../helper/footer";
import { ARInvoiceDetail } from "./arinvoicedetail";

export class ARInvoice {
  invoiceId: number;
  invoiceNo: string;  
  invoiceDate: string;
  clientId: number;
  clientInvNo: string;
  clientInvDate?: Date;
  amount: number;
  narration: string;
  periodId: number;
  periodName: string;
  reversedInvoiceNo: string;
  sourceInvoiceNo: string;
  details: ARInvoiceDetail[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
