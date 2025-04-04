import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupInvoice } from './groupinvoice';
import { GroupInvoiceDetail } from './groupinvoicedetail';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class GroupInvoiceService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getInvoices(): Observable<GroupInvoice[]> {
     return this.http.get<GroupInvoice[]>(this.apiURL + 'finance/GroupInvoice/' );
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'finance/GroupInvoice/GetLookups');
   }

   get(invoiceNo: string): Observable<GroupInvoice> {
     return this.http.get<GroupInvoice>(this.apiURL + 'finance/GroupInvoice/' + encodeURIComponent(invoiceNo));
   }

   load(clientId: number): Observable<GroupInvoiceDetail[]> {
     return this.http.get<GroupInvoiceDetail[]>(this.apiURL + 'finance/GroupInvoice/GetPendingInvoices/' + clientId);
   }

   save(gi: GroupInvoice) {
     return this.http.post<GroupInvoice>(this.apiURL + 'finance/GroupInvoice/', gi);
   } 
}  
