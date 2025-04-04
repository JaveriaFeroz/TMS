import { agFooter } from "../../helper/footer";

export class CoA {
  accountCode:number;  
  parentAccountId: number;
  accountName: string;
  accountTypeId: number;
  hfmCode: string;
  opBalance: number;
  opBalanceDate?: Date;
  remarks: string;
  isActive: boolean;
  hierarchy: string;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); this.opBalance = 0; this.opBalanceDate = new Date(); }
}
