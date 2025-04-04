import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductType } from './producttype';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class ProductTypeService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getProductTypes(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/ProductType/');
   }

   get(typeId: number): Observable<ProductType> {
     return this.http.get<ProductType>(this.apiURL + 'master/ProductType/' + typeId);
   }

   save(producttype: ProductType) {
     return this.http.post<ProductType>(this.apiURL + 'master/ProductType/', producttype);
   } 
}  
