import { agFooter } from "../../helper/footer";

export class Supplier {
  supplierId: number;
  supplierName: string;
  supplierTypeId: number;
  controlSupplierId: string;
  scRate: number;
  address: string;
  email: string;
  cityId: number;
  phoneNo: string;
  mobileNo: string;
  faxNo: string;
  ntn: string;
  url: string;
  contactName: string;
  isActive: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}

