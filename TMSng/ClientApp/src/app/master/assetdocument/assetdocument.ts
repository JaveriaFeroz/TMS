import { agFooter } from "../../helper/footer";
import { Documents } from "./documents";

export class AssetDocument {
  assetId: number;
  footer: agFooter;
  details: Documents[] = [];
  constructor() { this.footer = new agFooter(); }
}
