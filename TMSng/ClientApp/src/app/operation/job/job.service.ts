import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Job } from './job';
 @Injectable({  
  providedIn: 'root'  
})  
  
 export class JobService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getJobs(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'operation/Job/' );
   }

   get(jobNo: string): Observable<Job> {
     return this.http.get<Job>(this.apiURL + 'operation/Job/' + jobNo );
   }

   save(job: Job) {
     return this.http.post<any>(this.apiURL + 'operation/Job/', job);
   } 
}  
