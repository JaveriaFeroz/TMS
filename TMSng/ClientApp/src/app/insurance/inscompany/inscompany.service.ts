import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsCompany } from './inscompany';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class InsCompanyService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getInsCompanies(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'insurance/InsCompany/');
   }

   get(companyId: number): Observable<InsCompany> {
     return this.http.get<InsCompany>(this.apiURL + 'insurance/InsCompany/' + companyId);
   }

   save(ic: InsCompany) {
     return this.http.post<InsCompany>(this.apiURL + 'insurance/InsCompany/', ic);
   } 
}  
