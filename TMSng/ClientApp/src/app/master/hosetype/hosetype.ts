import { agFooter } from "../../helper/footer";

export class HoseType {
  hoseTypeId: number;
  hoseTypeName: string;
  isActive: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
