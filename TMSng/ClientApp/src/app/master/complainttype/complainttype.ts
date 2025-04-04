import { agFooter } from "../../helper/footer";

export class ComplaintType {
  typeId: number;
  typeName: string;
  isActive: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
