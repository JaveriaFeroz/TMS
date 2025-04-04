import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class UnInvoiceService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   unInvoice(invoiceno: string) {
     return this.http.post<any>(this.apiURL + 'finance/Invoice/UnInvoice/' + encodeURIComponent(invoiceno), null);
   } 
}  
