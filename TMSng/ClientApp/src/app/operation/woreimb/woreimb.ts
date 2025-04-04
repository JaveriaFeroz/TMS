import { agFooter } from "../../helper/footer";
import { WOReImbursementDetail } from './woreimbdetail';

export class WOReImbursement {
  requestId: number;
  periodFromId: number;
  periodToId: number;
  branchId: number;
  supplierId: number;
  subCategoryId: number;
  leaseTypeId: number;
  //departmentCode: string;   
  closed: boolean;
  periodFromName: string;
  periodToName: string;
  branchName: string;
  supplierName: string;
  leaseTypeName: string;
  stateName: string;
  details: WOReImbursementDetail[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}

