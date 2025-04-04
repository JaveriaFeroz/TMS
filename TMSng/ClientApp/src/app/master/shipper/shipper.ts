import { agFooter } from "../../helper/footer";

export class Shipper {
  shipperId: number;
  shipperName: string;
  address: string;
  cityId: number;
  clientId: number;
  contactNo: string;
  isActive: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
