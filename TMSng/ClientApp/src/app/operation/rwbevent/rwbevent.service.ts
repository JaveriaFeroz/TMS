import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RWBEvent } from './rwbevent';
import { RWBEvents } from './rwbevents';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class RWBEventService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getRwbEvents(rwbNo: string): Observable<RWBEvents[]> {
     return this.http.get<RWBEvents[]>(this.apiURL + 'operation/RWBEvent/GetEvents/' + rwbNo);
   }

   getConsignees(rwbId: number): Observable<RWBEvent[]> {
     return this.http.get<RWBEvent[]>(this.apiURL + 'operation/RWBEvent/GetRWBConsignees/' + rwbId);
   }

   getShortage(rwbId: number): Observable<any> {
     return this.http.get<any>(this.apiURL + 'operation/RWBEvent/GetShortage/' + rwbId);
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'operation/RWBEvent/GetLookups');
   }

   getAssets(rwbId: number, assetTypeId: number): Observable<any> {
     return this.http.get<any>(this.apiURL + 'operation/RWBEvent/GetAssetLookups/' + rwbId + '/' + assetTypeId);
   }
   

   get(rwbNo: string): Observable<any> {
     return this.http.get<any>(this.apiURL + 'operation/RWBEvent/' + rwbNo);
   }

   save(rwbevent: RWBEvent) {
     return this.http.post<any>(this.apiURL + 'operation/RWBEvent/SaveRWBEvent', rwbevent);
   }
}  
