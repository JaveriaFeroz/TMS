import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from './city';
 @Injectable({  
  providedIn: 'root'  
})  
  
export class CityService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'master/City/GetLookups');
   }

   getCities(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/City/');
   }

   get(cityId: number): Observable<City> {
     return this.http.get<City>(this.apiURL + 'master/City/' + cityId);
   }

   save(city: City) {
     return this.http.post<City>(this.apiURL + 'master/City/', city);
   } 
}  
