import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RWB } from './rwb';
 @Injectable({ providedIn: 'root' })  
  
 export class RWBService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getRWBs(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'operation/RWB/');
   }

   get(rwbNo: string): Observable<RWB> {
     return this.http.get<RWB>(this.apiURL + 'operation/RWB/' + rwbNo);
   }

   save(rwb: RWB) {
     return this.http.post<any>(this.apiURL + 'operation/RWB/', rwb);
   }
   
   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'operation/RWB/GetLookups');
   }

   getClients(): Observable<RWB[]> {
     return this.http.get<RWB[]>(this.apiURL + 'operation/RWB/GetClients');
   }

   //getClientLookup(): Observable<any> {
   //  return this.http.get<any>(this.apiURL + 'operation/RWB/GetClientLookups');
   //}
}  
