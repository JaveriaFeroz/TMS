import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessorialInvoice } from './accessorialinvoice';

 @Injectable({  providedIn: 'root'  })  
export class AccessorialInvoiceService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getInvoices(workFlowId: number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'finance/AccessorialInvoice/' + workFlowId);
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'finance/AccessorialInvoice/GetLookups');
   }

   get(invoiceNo: number, workFlowId: number): Observable<AccessorialInvoice> {
     return this.http.get<AccessorialInvoice>(this.apiURL + 'finance/AccessorialInvoice/' + encodeURIComponent(invoiceNo) + '/' + workFlowId);
   }

   save(ai: AccessorialInvoice) {
     return this.http.post<AccessorialInvoice>(this.apiURL + 'finance/AccessorialInvoice/', ai);
   } 
}  
