import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialPeriod } from './financialperiod';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class FinancialPeriodService {  

   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   get(periodTypeId: number): Observable<FinancialPeriod> {
     return this.http.get<FinancialPeriod>(this.apiURL + 'Finance/FinancialPeriod/' + periodTypeId );
   }

   close(periodTypeId: number) {
     return this.http.post<FinancialPeriod>(this.apiURL + 'Finance/FinancialPeriod/Close/' + periodTypeId, null);
   }  
}  
