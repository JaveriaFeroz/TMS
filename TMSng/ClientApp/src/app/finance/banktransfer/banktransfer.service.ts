import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BankTransfer } from './banktransfer';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class BankTransferService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getTransfers(): Observable<BankTransfer[]> {
     return this.http.get<BankTransfer[]>(this.apiURL + 'finance/BankTransfer/');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'finance/BankTransfer/GetLookups');
   }

   get(transferNo: string): Observable<BankTransfer> {
     return this.http.get<BankTransfer>(this.apiURL + 'finance/BankTransfer/' + encodeURIComponent(transferNo));
   }

   save(bt: BankTransfer) {
     return this.http.post<BankTransfer>(this.apiURL + 'finance/BankTransfer/', bt);
   }

   reverse(transferNo: string) {
     return this.http.post<any>(this.apiURL + 'finance/BankTransfer/Reverse/' + encodeURIComponent(transferNo), null);
   }
}
