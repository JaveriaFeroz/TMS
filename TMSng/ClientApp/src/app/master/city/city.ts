import { agFooter } from "../../helper/footer";

export class City {
  cityId: number;
  cityName: string;
  cityCode: string
  regionId: number;
  isActive: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
