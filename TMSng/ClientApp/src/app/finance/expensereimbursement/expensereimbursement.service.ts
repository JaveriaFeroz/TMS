import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpenseReImbursement } from './expensereimbursement';
import { ExpenseReImbursementDetail } from './expensereimbursementdetail';

 @Injectable({ providedIn: 'root'  })  
  
export class ExpenseReImbursementService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getReimbursements(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'finance/ExpenseReimbursement/');
   }

   getLookups(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'finance/ExpenseReimbursement/GetLookups');
   }

   get(requestId: number): Observable<ExpenseReImbursement> {
     return this.http.get<ExpenseReImbursement>(this.apiURL + 'finance/ExpenseReimbursement/' + requestId);
   }

   load(branchId: number, periodFromId: number, periodToId: number): Observable<ExpenseReImbursementDetail[]> {
     return this.http.get<ExpenseReImbursementDetail[]>(this.apiURL + 'finance/ExpenseReimbursement/GetPending/' + branchId + '/' + periodFromId + '/' + periodToId );
   }

   save(er: ExpenseReImbursement) {
     return this.http.post<any>(this.apiURL + 'finance/ExpenseReimbursement/', er);
   }

//   close(requestno: number) {
//     return this.http.post<any>(this.apiURL + 'finance/ExpenseReimbursement/Close/' + requestno, requestno);
//   } 
}  
