import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product';
 @Injectable({  
  providedIn: 'root'  
})  
  
export class ProductService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getProducts(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Product/');
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'master/Product/GetLookups');
   }

   get(productId: number): Observable<Product> {
     return this.http.get<Product>(this.apiURL + 'master/Product/' + productId);
   }

   save(product: Product) {
     return this.http.post<Product>(this.apiURL + 'master/Product/', product);
   }   
}
