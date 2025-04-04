import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessorialCharge } from './accessorialcharge';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class AccessorialChargeService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getCharges(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/AccessorialCharge/' );
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'master/AccessorialCharge/GetLookups');
   }

   get(acId: number): Observable<AccessorialCharge> {
     return this.http.get<AccessorialCharge>(this.apiURL + 'master/AccessorialCharge/' + acId);
   }

   save(ac: AccessorialCharge) {
     return this.http.post<AccessorialCharge>(this.apiURL + 'master/AccessorialCharge/', ac);
   } 
}  
