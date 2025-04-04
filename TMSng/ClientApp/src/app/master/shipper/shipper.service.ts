import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shipper } from './shipper';
 @Injectable({  
  providedIn: 'root'  
})  
  
export class ShipperService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getShippers(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Shipper/');
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'master/Shipper/GetLookups');
   }

   get(shipperId: number): Observable<Shipper> {
     return this.http.get<Shipper>(this.apiURL + 'master/Shipper/' + shipperId);
   }

   save(shipper: Shipper) {
     return this.http.post<Shipper>(this.apiURL + 'master/Shipper/', shipper);
   } 
}  
