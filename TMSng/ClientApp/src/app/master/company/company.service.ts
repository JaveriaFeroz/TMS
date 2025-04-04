import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from './company';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class CompanyService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getCompanies(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Company/' );
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'master/Company/GetLookups');
   }

   get(companyId: number): Observable<Company> {
     return this.http.get<Company>(this.apiURL + 'master/Company/' + companyId);
   }

   save(company: Company) {
     return this.http.post<Company>(this.apiURL + 'master/Company/', company);
   }
}  
