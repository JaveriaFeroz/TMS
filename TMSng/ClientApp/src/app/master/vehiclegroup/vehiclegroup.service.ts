import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleGroup } from './vehiclegroup';
 @Injectable({  
  providedIn: 'root'  
})  
  
export class VehicleGroupService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getVehicleGroups(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/VehicleGroup/');
   }

   get(groupId: number): Observable<VehicleGroup> {
     return this.http.get<VehicleGroup>(this.apiURL + 'master/VehicleGroup/' + groupId);
   }

   save(vg: VehicleGroup) {
     return this.http.post<VehicleGroup>(this.apiURL + 'master/VehicleGroup/', vg);
   } 
}  
