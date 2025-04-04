import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoA } from './coa';
 @Injectable({  
  providedIn: 'root'  
})  
  
export class COAService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getAccounts(): Observable<CoA[]> {
     return this.http.get<CoA[]>(this.apiURL + 'finance/COA/');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'finance/COA/GetLookups');
   }
  
   get(accountcode: string): Observable<CoA> {
     return this.http.get<CoA>(this.apiURL + 'finance/COA/' + accountcode);
   }

   save(coa: CoA) {
     return this.http.post<CoA>(this.apiURL + 'finance/COA/', coa);
   } 
}  
