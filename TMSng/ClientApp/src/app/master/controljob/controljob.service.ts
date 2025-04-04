import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ControlJob } from './controljob';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class ControlJobService {  

   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   get(): Observable<ControlJob> {
     return this.http.get<ControlJob>(this.apiURL + 'master/ControlJob/' );
   }

   save(controljob: ControlJob) {
     return this.http.post<ControlJob>(this.apiURL + 'master/ControlJob/', controljob);
   }  
}  
