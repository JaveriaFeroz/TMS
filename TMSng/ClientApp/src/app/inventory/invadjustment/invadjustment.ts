import { agFooter } from "../../helper/footer";
import { InvAdjustmentDetail } from './InvAdjustmentDetail';

export class InvAdjustment {
  adjId: number;
  adjDate: Date;
  branchId: number;
  //departmentCode: string;
  companyid: number;
  details: InvAdjustmentDetail[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
