import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SKUCategory } from './skucategory';

 @Injectable({  
  providedIn: 'root'  
})  
  
 export class SKUCategoryService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getCategories(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/SKUCategory/' );
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'master/SKUCategory/GetLookups');
   }

   get(categoryId: number): Observable<SKUCategory> {
     return this.http.get<SKUCategory>(this.apiURL + 'master/SKUCategory/' + categoryId);
   }

   save(category: SKUCategory) {
     return this.http.post<SKUCategory>(this.apiURL + 'master/SKUCategory/', category);
   } 
}  
