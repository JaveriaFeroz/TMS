import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GRN } from './grn';
import { GRNDetail } from './grndetail';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class GRNService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getGRNs(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'inventory/GRN/');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'inventory/GRN/GetLookups');
   }

   getPOs(): Observable<GRN[]> {
     return this.http.get<GRN[]>(this.apiURL + 'inventory/GRN/GetPOs');
   }

   getPODetails(poId: number): Observable<GRN> {
     return this.http.get<GRN>(this.apiURL + 'inventory/GRN/GetPODetails/' + poId);
   }

   get(grnId: number): Observable<GRN> {
     return this.http.get<GRN>(this.apiURL + 'inventory/GRN/' + grnId);
   }

   save(grn: GRN) {
     return this.http.post<GRN>(this.apiURL + 'inventory/GRN/', grn);
   }  
}
