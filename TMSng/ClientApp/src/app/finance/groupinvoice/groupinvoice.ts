import { agFooter } from "../../helper/footer";
import { GroupInvoiceDetail } from "./groupinvoicedetail";

export class GroupInvoice {
  groupInvoiceId: number;
  groupInvoiceNo: string;
  invoiceDate?: Date;
  clientId: number;
  details: GroupInvoiceDetail[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
