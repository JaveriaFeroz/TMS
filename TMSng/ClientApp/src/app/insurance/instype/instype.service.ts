import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsType } from './instype';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class InsTypeService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getInsTypes(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'insurance/InsType/');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'insurance/InsType/GetLookups');
   }

   get(typeId: number): Observable<InsType> {
     return this.http.get<InsType>(this.apiURL + 'insurance/InsType/' + typeId);
   }

   save(it: InsType) {
     return this.http.post<InsType>(this.apiURL + 'insurance/InsType/', it);
   } 
}  
