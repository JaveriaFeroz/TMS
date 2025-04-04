import { agFooter } from "../../helper/footer";
import { FuelPaymentRequestDetail } from './fuelpaymentrequestdetail';

export class FuelPaymentRequest {
  requestId: number;
  dateFrom?: Date;
  dateTo?: Date;
  isCardPayment: boolean;
  supplierId?: number;
  cardId?: number;
  details: FuelPaymentRequestDetail[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
