import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobClose } from './jobclose';
 @Injectable({  
  providedIn: 'root'  
})  
  
 export class JobCloseService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getJobs(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'operation/Job/');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'operation/Job/GetLookups');
   }

   get(jobNo: string): Observable<JobClose> {
     return this.http.get<JobClose>(this.apiURL + 'operation/Job/GetForClosure/' + jobNo );
   }

   close(job: JobClose) {
     return this.http.post<any>(this.apiURL + 'operation/Job/Close', job);
   } 
}  
