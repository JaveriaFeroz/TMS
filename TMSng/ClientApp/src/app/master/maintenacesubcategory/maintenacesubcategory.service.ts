import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MaintenaceSubcategory } from './maintenacesubcategory';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class MaintenaceSubCategoryService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getSubCategories(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/MaintenanceSubCategory/' );
   }

   get(scId: number): Observable<MaintenaceSubcategory> {
     return this.http.get<MaintenaceSubcategory>(this.apiURL + 'master/MaintenanceSubCategory/' + scId);
   }

   save(msc: MaintenaceSubcategory) {
     return this.http.post<MaintenaceSubcategory>(this.apiURL + 'master/MaintenanceSubCategory/', msc);
   }  
}  
