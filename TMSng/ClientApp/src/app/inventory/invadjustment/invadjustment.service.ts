import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvAdjustment } from './InvAdjustment';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class InvAdjustmentService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getInvAdjustments(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'Inventory/InvAdj/');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'Inventory/InvAdj/GetLookups');
   }

   get(adjNo: number): Observable<InvAdjustment> {
     return this.http.get<InvAdjustment>(this.apiURL + 'Inventory/InvAdj/' + adjNo);
   }

   save(ia: InvAdjustment) {
     return this.http.post<InvAdjustment>(this.apiURL + 'Inventory/InvAdj/', ia);
   }  
}  
