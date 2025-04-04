import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class ReOpenJobService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   reOpen(jobNo: string, reason :string) {
     return this.http.post<any>(this.apiURL + 'operation/Job/Reopen/' + jobNo + '/'+ reason,null);
   } 
}  
