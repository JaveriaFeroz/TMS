import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JR } from './jr';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class JRService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getReceipts(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'finance/JR/' );
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'finance/JR/GetLookups');
   }

   get(voucherNo: string): Observable<JR> {
     return this.http.get<JR>(this.apiURL + 'finance/JR/' + encodeURIComponent(voucherNo) );
   }

   save(jr: JR) {
     return this.http.post<JR>(this.apiURL + 'finance/JR/', jr);
   }

   reverse(voucherNo: string) {
     return this.http.post<string>(this.apiURL + 'finance/JR/Reverse/' + encodeURIComponent(voucherNo), null);
   }
}
