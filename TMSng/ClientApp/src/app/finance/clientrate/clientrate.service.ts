import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientRate } from './clientrate';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class ClientRateService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getClientRates(): Observable<any[]> {
     return this.http.get<ClientRate[]>(this.apiURL + 'finance/ClientRate/' );
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'finance/ClientRate/GetLookups');
   }

   get(clientId: number): Observable<ClientRate> {
     return this.http.get<ClientRate>(this.apiURL + 'finance/ClientRate/' + clientId);
   }

   //get(formid: number): Observable<ClientRate> {
   //  return this.http.get<ClientRate>(this.apiURL + 'finance/ClientRate/' + formid);
   //}

   //GetRateDetail(clientId: number, ratetypeid): Observable<ClientRate> {
   //  return this.http.get<ClientRate>(this.apiURL + 'finance/ClientRate/GetRateDetail/' + clientId + '/' + ratetypeid);
   //}

   //save(clientrate: ClientRate) {
   //  return this.http.post<any>(this.apiURL + 'finance/ClientRate/', clientrate);
   //}

   //SubmitClientRate(sub: Submission) {
   //  return this.http.post<any>(this.apiURL + 'finance/ClientRate/SubmiClientRate', sub);
   //} 
}  
