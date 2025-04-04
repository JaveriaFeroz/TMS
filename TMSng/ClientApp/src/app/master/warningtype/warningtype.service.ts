import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WarningType } from './warningtype';
 @Injectable({  
  providedIn: 'root'  
})  
  
export class WarningTypeService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getWarningTypes(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/WarningType/');
   }

   get(warningtypeId: number): Observable<WarningType> {
     return this.http.get<WarningType>(this.apiURL + 'master/WarningType/' + warningtypeId);
   }

   save(warningtype: WarningType) {
     return this.http.post<WarningType>(this.apiURL + 'master/WarningType/', warningtype);
   } 
}  
