import { agFooter } from "../../helper/footer";
import { AccessorialInvoiceDetail } from "./accessorialinvoicedetail";

export class AccessorialInvoice {
  invoiceId: number;
  invoiceNo: string;
  invoiceDate?: Date;
  clientId: number;
  amount: number;
  gstRate: number;
  refInvNo: string;
  refInvDate: string;
  refInvPeriod: string;
  workFlowId: number;
  remarks: string;
  footer: agFooter;
  details: AccessorialInvoiceDetail[] = [];
  constructor() { this.footer = new agFooter(); }
}
