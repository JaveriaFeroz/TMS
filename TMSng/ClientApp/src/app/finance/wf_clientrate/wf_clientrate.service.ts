import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Submission } from '../../helper/submission';
import { WF_ClientRate } from './wf_clientrate';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class WF_ClientRateService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getClientRates(): Observable<WF_ClientRate[]> {
     return this.http.get<WF_ClientRate[]>(this.apiURL + 'finance/WFClientRate/GetPendingForms/' );
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'finance/WFClientRate/GetLookups');
   }

   get(formId: number): Observable<WF_ClientRate> {
     return this.http.get<WF_ClientRate>(this.apiURL + 'finance/WFClientRate/' + formId);
   }

   getExistingRate(clientId: number): Observable<WF_ClientRate> {
     return this.http.get<WF_ClientRate>(this.apiURL + 'finance/WFClientRate/GetExistingRate/' + clientId);
   }

   save(clientrate: WF_ClientRate) {
     return this.http.post<any>(this.apiURL + 'finance/WFClientRate/', clientrate);
   }

   submit(sub: Submission) {
     return this.http.post<any>(this.apiURL + 'finance/WFClientRate/Submit', sub);
   }

   //getRateDetail(clientId: number, ratetypeId): Observable<WF_ClientRate> {
   //  return this.http.get<WF_ClientRate>(this.apiURL + 'finance/WFClientRate/GetRateDetail/' + clientId + '/' + ratetypeId);
   //}
}
