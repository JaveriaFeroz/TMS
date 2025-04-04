import { agFooter } from "../../helper/footer";
import { InvTransferDetail } from './invtransferdetail';

export class InvTransfer {
  transferId: number;
  transferDate: Date;
  fromBranchId: number;
  toBranchId: number;
  owner: string;
  stateId: number
  statusName: string;
  completed: boolean;
  details: InvTransferDetail[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
