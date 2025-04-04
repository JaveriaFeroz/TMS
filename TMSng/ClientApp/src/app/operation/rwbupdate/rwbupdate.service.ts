import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from '../../master/asset/asset';
import { RWB } from '../rwb/rwb';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class RwbUpdateService {  RwbUpdate
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }
  
   //getClients(): Observable<any> {
   //  return this.http.get<any>(this.apiURL + 'operation/Rwb/GetClientLookups');
   //}

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'operation/RWB/GetLookups');
   }

   get(rwbNo: string): Observable<RWB> {
     return this.http.get<RWB>(this.apiURL + 'operation/Rwb/GetForUpdate/' + rwbNo);
   }

   update(rwb: RWB) {
     return this.http.post<RWB>(this.apiURL + 'operation/Rwb/SaveUpdates/', rwb);
   }
}
