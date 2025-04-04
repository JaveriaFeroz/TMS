import { agFooter } from "../../helper/footer";
import { GRNDetail } from './grndetail';

export class GRN {
  grnNo: string;
  grnId?: number;
  grnDate: Date;
  poNo?: number;
  grnTypeId: number;
  supplierId: number;
  branchId: number;
  moPId: number;
  refNo: string;
  refDate: string;
  details: GRNDetail[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
