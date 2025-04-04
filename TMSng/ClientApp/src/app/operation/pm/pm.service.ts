import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PM } from './pm';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class PMService {  
   private apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getPMs(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'operation/PM/');
   }

   getLookUp() {
     return this.http.get<any>(this.apiURL + 'operation/PM/GetLookups');
   }

   get(pmId: number): Observable<PM> {
     return this.http.get<PM>(this.apiURL + 'operation/PM/' + pmId);
   }

   save(pm: PM) {
     return this.http.post<PM>(this.apiURL + 'operation/PM/', pm);
   }
}
