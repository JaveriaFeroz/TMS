import { agFooter } from "../../helper/footer";

export class ChequeBook {
  bookId?: number;
  bookName: string;
  accountId: number;
  issueDate?: Date;
  prefix: string;
  startChqNo: number;
  endChqNo: number;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
