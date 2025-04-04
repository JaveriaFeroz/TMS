import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class WOReImbursementExtractService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookup(): Observable<any> {
    return this.http.get<any>(this.apiURL + 'operation/WOReImbursement/GetLookups');
  }

   get(branchId: number, supplierId: number, subCategoryId: number, periodFromId: number, periodToId: number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'operation/WOReImbursement/Extract/' + branchId + '/' + supplierId + '/' + subCategoryId + '/' + periodFromId + '/' + periodToId );
   }
}
