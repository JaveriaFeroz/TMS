import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Submission } from '../../helper/submission';
import { InvTransfer } from '../invtransfer/invtransfer';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class InvTransferService { 
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getInvTransfers(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'Inventory/InvTransfer/');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'Inventory/InvTransfer/GetLookups');
   }

   
   get(transferNo: number): Observable<InvTransfer> {
     return this.http.get<InvTransfer>(this.apiURL + 'Inventory/InvTransfer/' + transferNo);
   }

   save(it: InvTransfer) {
     return this.http.post<InvTransfer>(this.apiURL + 'Inventory/InvTransfer/', it);
   }

   transfer(sub: Submission) {
     return this.http.post<Submission>(this.apiURL + 'Inventory/InvTransfer/Transfer', sub);
   }

   receive(sub: Submission) {
     return this.http.post<Submission>(this.apiURL + 'Inventory/InvTransfer/Receive', sub);
   }

   cancel(sub: Submission) {
     return this.http.post<Submission>(this.apiURL + 'Inventory/InvTransfer/Cancel', sub);
   }
}  
