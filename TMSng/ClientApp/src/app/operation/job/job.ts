import { Time } from "@angular/common";
import { agFooter } from "../../helper/footer";

export class Job{
  jobId: number;
  jobNo: string;  
  jobDate: Date;
  advance: number;
  jobStartDate: Date;
  jobStartTime: Date;
  //jobStatusId: number
  stateName: string
/*  companyid: number;*/
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
