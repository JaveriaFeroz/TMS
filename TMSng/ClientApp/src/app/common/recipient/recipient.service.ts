import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipient } from './recipient';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class RecipientService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getHistory(workflowId: number, formid: number): Observable<any> {
     return this.http.get<any>(this.apiURL + 'common/Recipient/GetHistory/' + workflowId + '/' +  formid);
   }

   getRecipients(workflowId: number, stateId: number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'common/Recipient/GetRecipients/' + workflowId + '/' + stateId);
   }

   getOwner(workflowId: number, formid: number): Observable<any> {    
     return this.http.get<any>(this.apiURL + 'common/Recipient/GetOwner/' + workflowId + '/' + formid);
   }

   getWORecipients(woId: number, stateId: number): Observable<any> {
     return this.http.get<Recipient>(this.apiURL + 'common/Recipient/GetWORecipients/' + woId + '/' + stateId);
   }

   getInvTransferRecipients(transferNoteId: number): Observable<any> {
     return this.http.get<Recipient>(this.apiURL + 'common/Recipient/GetInvTransferRecipients/' + transferNoteId);
   }

   getInvTransferOwners(transferNoteId: number) {
     return this.http.get<any[]>(this.apiURL + 'common/Recipient/GetInvTransferOwners/' + transferNoteId);
   }

   getClientRates(formid: number, stateId: number) {
     return this.http.get<any[]>(this.apiURL + 'common/Recipient/GetClientRateRecipients/' + formid+'/' + stateId);
   }

   getInvoices(formid: number) {
     return this.http.get<any[]>(this.apiURL + 'common/Recipient/GetInvoiceRecipients/' + formid);
   }
}
