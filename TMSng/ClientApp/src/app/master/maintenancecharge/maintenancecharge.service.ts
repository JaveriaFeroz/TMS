import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  MaintenanceCharge } from './maintenancecharge';
 @Injectable({  
  providedIn: 'root'  
})  
  
 export class MaintenanceChargeService {

   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   GetMaintenanceCharges(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/MaintenanceCharge/');
   }

   Get(chargeId: number): Observable<MaintenanceCharge> {
     return this.http.get<MaintenanceCharge>(this.apiURL + 'master/MaintenanceCharge/' + chargeId);
   }

   Save(charge: MaintenanceCharge) {
     return this.http.post<MaintenanceCharge>(this.apiURL + 'master/MaintenanceCharge/', charge);
   }   
}  
