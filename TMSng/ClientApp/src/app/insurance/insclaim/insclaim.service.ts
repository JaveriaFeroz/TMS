import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsClaim } from './insclaim';

 @Injectable({ providedIn: 'root' })  
  
 export class InsClaimService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getClaims(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'insurance/InsClaim');
   }

   getLookups(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'insurance/InsClaim/GetLookups');
   }

   get(claimId: number): Observable<InsClaim> {
     return this.http.get<InsClaim>(this.apiURL + 'insurance/InsClaim/' + claimId);
   }

   save(ic: InsClaim) {
     return this.http.post<InsClaim>(this.apiURL + 'insurance/InsClaim/', ic);
   }

   close(claimId: number) {
     return this.http.post<InsClaim>(this.apiURL + 'insurance/InsClaim/Close/' + claimId, claimId);
   }

   upload(formData: FormData) {
     return this.http.post<any>(this.apiURL + 'insurance/InsClaim/Upload', formData);
   }

   getDocuments(claimId: number): Observable<any> {
     return this.http.get<any>(this.apiURL + 'insurance/InsClaim/GetDocuments/' + claimId);
   }

   getDoc(documentId: number): Observable<any> {
     return this.http.get<any>(this.apiURL + 'insurance/InsClaim/View/' + documentId);
   }  
} 
