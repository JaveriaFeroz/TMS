import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FuelCard } from './fuelcard';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class FuelCardService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getFuelCards(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/FuelCard/');
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'master/FuelCard/GetLookups');
   }

   get(cardId: number): Observable<FuelCard> {
     return this.http.get<FuelCard>(this.apiURL + 'master/FuelCard/' + cardId);
   }

   save(fuelcard: FuelCard) {
     return this.http.post<FuelCard>(this.apiURL + 'master/FuelCard/', fuelcard);
   }
 }
