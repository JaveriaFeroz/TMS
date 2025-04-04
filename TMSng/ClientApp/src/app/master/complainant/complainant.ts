import { agFooter } from "../../helper/footer";

export class Complainant {
  complainantId: number;
  complainantName: string;
  isActive: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
