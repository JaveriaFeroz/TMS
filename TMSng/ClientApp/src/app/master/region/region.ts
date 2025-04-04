import { agFooter } from "../../helper/footer";

export class Region {
  regionId: number;
  regionName: string;
  taxRate: number;
  isActive: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
