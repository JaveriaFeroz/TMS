import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpenseHead } from './expensehead';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class ExpenseHeadService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getExpenseHeads(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/ExpenseHead/' );
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'master/ExpenseHead/GetLookups');
   }

   get(heaId: number): Observable<ExpenseHead> {
     return this.http.get<ExpenseHead>(this.apiURL + 'master/ExpenseHead/' + heaId);
   }

   save(expensehead: ExpenseHead) {
     return this.http.post<ExpenseHead>(this.apiURL + 'master/ExpenseHead/', expensehead);
   } 
}  
