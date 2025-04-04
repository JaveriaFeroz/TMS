import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WHTaxExemption } from './whtaxexemption';
 @Injectable({  
  providedIn: 'root'  
})  
  
export class WHTaxExemptionService {
   private apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getExemptions(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/WHTExemption/');
   }

   get(exemptionId: number): Observable<WHTaxExemption> {
     return this.http.get<WHTaxExemption>(this.apiURL + 'master/WHTExemption/' + exemptionId);
   }

   save(whte: WHTaxExemption) {
     return this.http.post<WHTaxExemption>(this.apiURL + 'master/WHTExemption/', whte);
   } 
}  
