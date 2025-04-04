import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RWBExpense } from './rwbexpense';
 @Injectable({  
  providedIn: 'root'  
})  
  
 export class RWBExpenseService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getRWBs(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'operation/RWB/');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'operation/RWBExpense/GetLookups');
   }

   get(rwbNo: string): Observable<RWBExpense> {
     return this.http.get<RWBExpense>(this.apiURL + 'operation/RWBExpense/' + rwbNo);
   }

   save(rwbexpense: RWBExpense) {
     return this.http.post<RWBExpense>(this.apiURL + 'operation/RWBExpense/', rwbexpense);
   }
}
