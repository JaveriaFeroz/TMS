import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Region } from './region';
 @Injectable({  
  providedIn: 'root'  
})  
  
 export class RegionService {  


   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getRegions(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Region/');
   } 

   get(regionId: number): Observable<Region> {
     return this.http.get<Region>(this.apiURL + 'master/Region/' + regionId);
   }

   save(region: Region) {
     return this.http.post<Region>(this.apiURL + 'master/Region/', region);
   }   
}  
