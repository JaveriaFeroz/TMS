import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Consignee } from './consignee';
 @Injectable({  
  providedIn: 'root'  
})  
  
export class ConsigneeService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getConsignees(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Consignee/');
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'master/Consignee/GetLookups');
   }

   get(consigneeId: number): Observable<Consignee> {
     return this.http.get<Consignee>(this.apiURL + 'master/Consignee/' + consigneeId);
   }

   save(consignee: Consignee) {
     return this.http.post<Consignee>(this.apiURL + 'master/Consignee/', consignee);
   } 
}  
