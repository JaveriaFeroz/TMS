import { agFooter } from "../../helper/footer";
import { PaymentDetail } from "./paymentdetail";
import { PaymentAllocation } from "./paymentallocation";

export class Payment {
  pyId: number;
  pyNo: string;
  pyDate?: Date;
  supplierId: number;
  bankAccountId: number;
  instrumentId: number;
  chequeBookId: number;
  chequeNo: string;
  chequeDate: string;
  narration: string;
  amount: number;
  periodId: number;
  periodName: string;
  reversedPYNo: string;
  sourcePYNo: string;
  details: PaymentDetail[] = [];
  allocations: PaymentAllocation[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
