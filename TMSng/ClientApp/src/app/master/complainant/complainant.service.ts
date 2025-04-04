import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Complainant } from './complainant';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class ComplainantService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getComplainants(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Complainant/');
   }

   get(complainantId: number): Observable<Complainant> {
     return this.http.get<Complainant>(this.apiURL + 'master/Complainant/' + complainantId);
   }

   save(complainant: Complainant) {
     return this.http.post<Complainant>(this.apiURL + 'master/Complainant/', complainant);
   }
}
