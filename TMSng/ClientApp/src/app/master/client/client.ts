import { agFooter } from "../../helper/footer";
import { ClientInvoiceFormat } from "./clientinvoiceformat";

export class Client {
  clientId:number;  
  accountId: number;
  clientName: string;
  shortName: string;
  address:string;
  cityId: number;
  industryVerticalId: number; 
  contractPeriod: number;
  contactNo: string;
  faxNos: string;
  email: string;
  url: string;
  contactPerson: string;
  paymentModeId: number;
  creditLimit: number;
  creditDays: number;
  cwClientId: string;
  ntn: string;
  strn: string;
  hierarchy: string;
  //standardLoadingTime: number;
  isActive: boolean;
  details: ClientInvoiceFormat[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }   
}

