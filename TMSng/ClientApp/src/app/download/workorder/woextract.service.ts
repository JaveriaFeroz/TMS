import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

 @Injectable({  
  providedIn: 'root'  
})  
  
 export class WOExtractService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'download/Shortage/GetLookups');
   }

   getPendingRequest(datefrom: Date, dateto: Date) {
     return this.http.get<any[]>(this.apiURL + 'operation/ServiceRequest/GetPending/' + formatDate(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + formatDate(dateto, 'yyyy-MM-dd', 'en-US') );
     }

   getPending(datefrom: Date, dateto: Date) {
     return this.http.get<any[]>(this.apiURL + 'operation/WorkOrder/GetPending/' + formatDate(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + formatDate(dateto, 'yyyy-MM-dd', 'en-US') );
     }

   getClosed(periodFromId: number, periodToId: number) {
     return this.http.get<any[]>(this.apiURL + 'operation/WorkOrder/GetClosed/' + periodFromId + '/' + periodToId);
   } 
}  
