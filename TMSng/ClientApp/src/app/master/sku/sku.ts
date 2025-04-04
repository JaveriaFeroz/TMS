import { agFooter } from "../../helper/footer";
import { SKUClient } from "./skuclient";

export class SKU {
  skuId: number;
  skuName: string;
  skuTypeId: number;
  isActive: boolean;
  footer: agFooter;
  details: SKUClient[] = [];
  constructor() { this.footer = new agFooter(); }
}
