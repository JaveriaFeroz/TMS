import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComplaintType } from './complainttype';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class ComplaintTypeService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getComplaintTypes(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/ComplaintType/' );
   }

   get(complainttypeId: number): Observable<ComplaintType> {
     return this.http.get<ComplaintType>(this.apiURL + 'master/ComplaintType/' + complainttypeId);
   }
 
   save(complainttype: ComplaintType) {
     return this.http.post<ComplaintType>(this.apiURL + 'master/ComplaintType/', complainttype);
   }   
}  
