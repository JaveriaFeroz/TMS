import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SKU } from './sku';

 @Injectable({  
  providedIn: 'root'  
})  
  
 export class SKUService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getSKUs(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/SKU/' );
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'master/SKU/GetLookups');
   }

   get(skuId: number): Observable<SKU> {
     return this.http.get<SKU>(this.apiURL + 'master/SKU/' + skuId);
   }

   save(sku: SKU) {
     return this.http.post<SKU>(this.apiURL + 'master/SKU/', sku);
   } 
}  
