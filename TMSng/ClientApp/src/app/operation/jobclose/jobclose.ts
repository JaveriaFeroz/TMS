import { Time } from "@angular/common";
import { agFooter } from "../../helper/footer";
import { JobFuel } from './jobfuel';
import { JobGensetFuel } from './jobgensetfuel';

export class JobClose {
  jobId: number;
  jobNo: string;  
  jobDate: Date;
  advance: number;
  jobStartDate: Date;
  jobStartTime: Date;
  stateId: number;
  stateName: string;
  jobCloseDate: Date;
  jobCloseTime: Date;
  closeKMs: number;
  lastKm: number;
  fuelLtrs: number;
  cashReturned: number;
  outsourced: Boolean;
  gensetFuelLtrs: number;
  gensetCashReturned: number;
  hasGenset: Boolean;
  vehicleFuel: JobFuel[] = [];
  genSetFuel: JobGensetFuel[] = [];
  closed: Boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
   
}
