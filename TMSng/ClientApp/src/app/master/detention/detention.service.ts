import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Detention } from './detention';
 @Injectable({  
  providedIn: 'root'  
})  
  
export class DetentionService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getDetentions(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Detention/');
   }

   get(detentionId: number): Observable<Detention> {
     return this.http.get<Detention>(this.apiURL + 'master/Detention/' + detentionId);
   }

   save(det: Detention) {
     return this.http.post<Detention>(this.apiURL + 'master/Detention/', det);
   } 
}  
