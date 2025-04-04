import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Submission } from '../../helper/submission';
import { WorkOrder } from './workorder';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class WorkOrderService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getWorkOrders(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'operation/WorkOrder/' );
   }

   getLookups(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'operation/WorkOrder/GetLookups/');
   }

   get(wono: string): Observable<WorkOrder> {
     return this.http.get<WorkOrder>(this.apiURL + 'operation/WorkOrder/' + wono);
   }

   save(wo: WorkOrder) {
     return this.http.post<any>(this.apiURL + 'operation/WorkOrder/', wo);
   }

   getServiceRequests(): Observable<WorkOrder[]> {
     return this.http.get<WorkOrder[]>(this.apiURL + 'operation/WorkOrder/GetServiceRequests/' );
   }

   getMaintenaceHistory(assetid: number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Asset/GetAssetMaintHistory/' + assetid);
   }

   getActivities(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'operation/WorkOrder/GetActivities/'+ 0  );
   }
   
   saveActual(wo: WorkOrder) {
     return this.http.post<any>(this.apiURL + 'operation/WorkOrder/SaveActual', wo);
   }

   submit(sub: Submission) {
     return this.http.post<any>(this.apiURL + 'operation/WorkOrder/Submit', sub);
   } 
}  
