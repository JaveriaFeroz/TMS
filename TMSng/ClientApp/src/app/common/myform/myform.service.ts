import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

 @Injectable({  
  providedIn: 'root'  
})  
  
 export class MyFormService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   ActiveForms(workflowId:number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'common/FormGroup/ActiveForms/' + workflowId);
   }

   CompletedForms(workflowId: number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'common/FormGroup/CompletedForms/' + workflowId);
   }

   SentForms(workflowId: number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'common/FormGroup/SentForms/' + workflowId);
   } 
}  
