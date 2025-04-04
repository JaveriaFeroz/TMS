import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsPolicy } from './inspolicy';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class InsPolicyService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getPolicies(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'insurance/InsPolicy');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'insurance/InsPolicy/GetLookups');
   }

   get(policyId: number): Observable<InsPolicy> {
     return this.http.get<InsPolicy>(this.apiURL + 'insurance/InsPolicy/' + policyId);
   }

   save(ip: InsPolicy) {
     return this.http.post<InsPolicy>(this.apiURL + 'insurance/InsPolicy/', ip);
   } 
}  
