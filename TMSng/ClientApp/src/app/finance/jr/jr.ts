import { agFooter } from "../../helper/footer";
import { JRDetail } from "./jrdetail";

export class JR {
  voucherId: number;
  voucherNo: string;
  voucherDate: string;
  chequeNo: string;
  chequeDate?: Date;
  bankAccountId: number;
  payerName: string;
  amount: number;
  narration: string;
  periodId: number;
  periodName: string;
  reversedJRNo: string;
  sourceJRNo: string;
  /*    accountId: number;*/
  details: JRDetail[] = [];
  footer: agFooter;
  costructor() { this.footer = new agFooter(); }
}
