import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FuelPaymentRequest } from './fuelpaymentrequest';
import { FuelPaymentRequestDetail } from './fuelpaymentrequestdetail';

 @Injectable({ providedIn: 'root' })  
  
export class FuelPaymentRequestService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getRequests(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'finance/FuelPaymentRequest/');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'finance/FuelPaymentRequest/GetLookups');
   }

   get(requestId: number): Observable<FuelPaymentRequest> {
     return this.http.get<FuelPaymentRequest>(this.apiURL + 'finance/FuelPaymentRequest/' + requestId);
   }

   getCardPending(cardId: number, dateFrom: Date, dateTo: Date): Observable<FuelPaymentRequestDetail[]> {
     return this.http.get<FuelPaymentRequestDetail[]>(this.apiURL + 'finance/FuelPaymentRequest/GetForCard/' + cardId + '/' +
       formatDate(dateFrom, "yyyy-MM-dd", "en-uk", "+0500") + '/' + formatDate(dateTo, "yyyy-MM-dd", "en-uk", "+0500"));
   }

   getSupplierPending(supplierId: number, dateFrom: Date, dateTo: Date): Observable<FuelPaymentRequestDetail[]> {
     return this.http.get<FuelPaymentRequestDetail[]>(this.apiURL + 'finance/FuelPaymentRequest/GetForSupplier/' + supplierId + '/' +
       formatDate(dateFrom, "yyyy-MM-dd", "en-uk", "+0500") + '/' + formatDate(dateTo, "yyyy-MM-dd", "en-uk", "+0500"));
   }

   save(fp: FuelPaymentRequest) {
     return this.http.post<any>(this.apiURL + 'finance/FuelPaymentRequest/', fp);
   }

   //close(requestno: number) {
   //  return this.http.post<any>(this.apiURL + 'finance/ExpenseReimbursement/Close/' + requestno, requestno);
   //}   
} 
