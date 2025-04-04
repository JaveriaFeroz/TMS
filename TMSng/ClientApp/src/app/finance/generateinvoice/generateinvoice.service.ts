import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Submission } from '../../helper/submission';
import { formatDate } from '@angular/common';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class InvoiceService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getClients(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'master/Client/');
   }

   generate(clientId: number, invoiceFrom: Date, invoiceTo: Date, reApplyRate: boolean, taxRate: number) {
     return this.http.post<any>(this.apiURL + 'finance/Invoice/GenerateInvoice/' + clientId + '/' + formatDate(invoiceFrom, 'yyyy-MM-dd', 'en-US') + '/' + formatDate(invoiceTo, 'yyyy-MM-dd', 'en-US') + '/' + reApplyRate + '/' + taxRate, null);
   }

   submit(sub: Submission) {
     return this.http.post<any>(this.apiURL + 'finance/Invoice/Submit', sub);
   }
}
