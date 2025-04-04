import { agFooter } from "../../helper/footer";
import { JVDetail } from "./jvdetail";

export class JV {
  voucherId: number;
  voucherNo: string;  
  voucherDate: string;
  narration: string;
  periodId: number;
  periodName: string;
  reversedVoucherNo: string;
  sourceVoucherNo: string;
  details: JVDetail[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
