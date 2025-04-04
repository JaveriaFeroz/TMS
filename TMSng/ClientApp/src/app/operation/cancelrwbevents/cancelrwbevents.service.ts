import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RWBEvents } from './rwbevents';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class CancelRWBEventService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   get(rwbNo: string): Observable<RWBEvents[]>{
     return this.http.get<RWBEvents[]>(this.apiURL + 'operation/RWBEvent/GetEvents/' + rwbNo);
   }

   cancel(rwbNo: string, cancelDate: Date) {
     return this.http.post<any>(this.apiURL + 'operation/RWBEvent/Cancel/' + rwbNo + '/' + formatDate(cancelDate,  'ddMMyyyyHH:mm', 'en-US'), null);
   }
}
