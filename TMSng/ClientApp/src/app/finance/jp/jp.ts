import { agFooter } from "../../helper/footer";
import { JPDetail } from "./jpdetail";
import { JPTrip } from "./jptrip";

export class JP {
  voucherId: number;
  voucherNo: string;
  voucherDate: string;
  bankAccountId: number;
  instrumentId: number;
  chequeBookId: number;
  chequeNo: string;
  chequeDate?: Date;
  payeeName: string;
  narration: string;
  amount: number;
  periodId: number;
  periodName: string;
  reversedJPNo: string;
  sourceJPNo: string;
  hasTrip: boolean;
  clientId?: number;
  jobDateFrom?: Date;
  jobDateTo?: Date;
  details: JPDetail[] = [];
  trips: JPTrip[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
