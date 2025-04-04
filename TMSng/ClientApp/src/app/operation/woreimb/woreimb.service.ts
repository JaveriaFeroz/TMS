import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WOReImbursement } from './woreimb';
import { WOReImbursementDetail } from './woreimbdetail';

 @Injectable({  
  providedIn: 'root'  
})  
  
 export class WOReImbService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getReimbursements(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'operation/WOReImbursement/' );
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'operation/WOReImbursement/GetLookups');
   }

   get(requestId: number): Observable<WOReImbursement> {
     return this.http.get<WOReImbursement>(this.apiURL + 'operation/WOReImbursement/' + requestId );
   }

   load(branchId: string, supplierId: number, subCategoryId: number, periodFromId: number, periodToId: number, leaseTypeId: number): Observable<WOReImbursementDetail[]> {
     return this.http.get<WOReImbursementDetail[]>(this.apiURL + 'operation/WOReImbursement/GetPendingWO/' + branchId + '/' + supplierId  + '/' + subCategoryId + '/' + periodFromId + '/' + periodToId + '/' + leaseTypeId);
   }

   save(wore: WOReImbursement) {
     return this.http.post<WOReImbursement>(this.apiURL + 'operation/WOReImbursement/', wore );
   }

   close(requestId: number) {
     return this.http.post<any>(this.apiURL + 'operation/WOReImbursement/Close/' + requestId, requestId);
   } 
}  
