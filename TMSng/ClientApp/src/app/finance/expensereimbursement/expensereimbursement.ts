import { agFooter } from "../../helper/footer";
import { ExpenseReImbursementDetail } from './expensereimbursementdetail';

export class ExpenseReImbursement {
  requestId: number;
  branchId?: number;
  periodFromId?: number;
  periodToId?: number;  
  //closed: boolean;
  //status: string;
  details: ExpenseReImbursementDetail[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
