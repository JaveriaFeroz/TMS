import { agFooter } from "../../helper/footer";

export class FuelCard {
  cardId: number;
  cardNo: string;
  cardLimit: number;
  supplierId: number;
  clientId: number;
  isActive: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
