import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Driver } from './driver';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class DriverService {  

   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getDrivers(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Driver/');
   }

   getLookups(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'master/Driver/GetLookups');
   }

   get(driverid: number): Observable<Driver> {
     return this.http.get<Driver>(this.apiURL + 'master/Driver/' + driverid);
   }

   save(driver: any) {
     return this.http.post<any>(this.apiURL + 'master/Driver/', driver);
   }

   isDuplicateDriverDox(driverId: Driver) {
     return this.http.post<Driver>(this.apiURL + 'master/Driver/IsDuplicateDriverDox/', driverId);
   }

   upload(formData: FormData) {
     return this.http.post<any>(this.apiURL + 'master/Driver/Upload', formData);
   }

   getDoc(documentid: number): Observable<any> {
     return this.http.get<any>(this.apiURL + 'master/Driver/View/' + documentid);
   }

   getDocuments(driverid: number): Observable<any> {
     return this.http.get<any>(this.apiURL + 'master/Driver/GetDocuments/' + driverid);
   }
}
