import { agFooter } from "../../helper/footer";
import { ReceiptDetail } from "./receiptdetail";
import { ReceiptAllocation } from "./receiptallocation";

export class Receipt {
  receiptId: number;
  receiptNo: string;
  receiptDate?: Date;
  clientId: number;
  bankAccountId: number;
  chequeNo: string;
  chequeDate: string;
  narration: string;
  amount: number;
  periodId: number;
  periodName: string;
  reversedReceiptNo: string;
  sourceReceiptNo: string;
  details: ReceiptDetail[] = [];
  allocations: ReceiptAllocation[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
