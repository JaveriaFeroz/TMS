import { agFooter } from "../../helper/footer";
import { BankTransferDetail } from "./banktransferdetail";

export class BankTransfer {
  transferId: number;
  transferNo: string;
  transferDate: string;
  crBankAccountId: number;
  drBankAccountId: number;
  instrumentId: number;
  chequeBookId: number;
  chequeId: number;
  chequeNo: string;
  chequeDate: string;  
  narration: string;
  periodId: number;
  periodName: string;
  reversedTransferNo: string;
  sourceTransferNo: string;
  amount: number;
  details: BankTransferDetail[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
