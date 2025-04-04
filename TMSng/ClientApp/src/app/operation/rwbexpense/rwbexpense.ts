import { agFooter } from "../../helper/footer";
import { RWBCharges } from "../rwb/rwbcharges";
import { CashFuel } from "./cashfuel";
import { RWBExpenseDetail } from './rwbexpensedetail';

export class RWBExpense {
  rwbId: number;
  jobId: number;
  rwbNo: string;
  rwbDate: string;
  jobNo: string;  
  jobStartDate: string;
  jobDate: string;
  jobStateName: string;
  rwbStateName: string;
  comments: string;
  branchId: number;
  fuelAvg: number;
  transitTime: number;
  expenses: RWBExpenseDetail[] = [];
  charges: RWBCharges[] = [];
  cashFuels: CashFuel[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }   
}
