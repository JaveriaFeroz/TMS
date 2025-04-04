import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoFence } from './geofence';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class GeoFenceService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getFences(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/GeoFence/' );
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'master/GeoFence/GetLookups');
   }

   get(fenceId: number): Observable<GeoFence> {
     return this.http.get<GeoFence>(this.apiURL + 'master/GeoFence/' + fenceId);
   }

   save(geofence: GeoFence) {
     return this.http.post<GeoFence>(this.apiURL + 'master/GeoFence/', geofence);
   } 
}  
