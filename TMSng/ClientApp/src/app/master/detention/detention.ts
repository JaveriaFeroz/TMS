import { agFooter } from "../../helper/footer";

export class Detention {
  detentionId: number;
  detentionName: string;
  hRsThreshold: number;
  isActive: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
