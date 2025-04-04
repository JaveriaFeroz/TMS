import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Submission } from '../../helper/submission';
import { ServiceRequest } from './servicerequest';

@Injectable({  
  providedIn: 'root'  
})  
  
export class ServiceRequestService {   
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

  getServiceRequests(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'operation/ServiceRequest/' );
   }

   getLookups(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'operation/ServiceRequest/GetLookups/');
   }

   get(requestId: number): Observable<ServiceRequest> {
     return this.http.get<ServiceRequest>(this.apiURL + 'operation/ServiceRequest/' + requestId );
   }      

   save(servicerequest: ServiceRequest) {
     return this.http.post<any>(this.apiURL + 'operation/ServiceRequest/', servicerequest);
   }

   submit(sub: Submission) {
     return this.http.post<any>(this.apiURL + 'operation/ServiceRequest/Submit', sub);
   }

   getMaintenaceHistory(assetid: number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Asset/GetAssetMaintHistory/' + assetid);
   }
}
