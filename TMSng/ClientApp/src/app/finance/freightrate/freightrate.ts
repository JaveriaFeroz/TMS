import { agFooter } from "../../helper/footer";

export class FreightRate {
  localRate0To64: number;
  localRate65To1980: number;
  localRateAbove1980: number;
  localRateHilly: number;
  upCountryRate0To77: number;
  upCountryRate78To560: number;
  upCountryRateAbove560: number;
  upCountryHilly: number;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
