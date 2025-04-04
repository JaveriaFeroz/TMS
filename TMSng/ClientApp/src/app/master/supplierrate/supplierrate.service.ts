import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupplierRate } from './supplierrate';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class SupplierRateService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getRates(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/SupplierRate/' );
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'master/SupplierRate/GetLookups');
   }

   get(supplierId: number): Observable<SupplierRate> {
     return this.http.get<SupplierRate>(this.apiURL + 'master/SupplierRate/' + supplierId);
   }

   save(rate: SupplierRate) {
     return this.http.post<SupplierRate>(this.apiURL + 'master/SupplierRate/', rate);
   } 
}  
