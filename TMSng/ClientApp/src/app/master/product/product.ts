import { agFooter } from "../../helper/footer";

export class Product {
  productId: number;
  productName: string;
  //uoMId: number;
  purchasePrice: number;
  productTypeId: number;
  uoMName: string;
  //productNatureId: number;
  productNatureName: string;
  isActive: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
