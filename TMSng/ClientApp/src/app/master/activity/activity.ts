import { agFooter } from "../../helper/footer";

export class Activity {
  activityId: number;
  activityName: string;
  estHrsReq: number;
  isActive: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
