import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RouteGroup } from './routegroup';
 @Injectable({  
  providedIn: 'root'  
})  
  
export class RouteGroupService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getRouteGroups(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/RouteGroup/');
   }

   get(groupId: number): Observable<RouteGroup> {
     return this.http.get<RouteGroup>(this.apiURL + 'master/RouteGroup/' + groupId);
   }

   save(rg: RouteGroup) {
     return this.http.post<RouteGroup>(this.apiURL + 'master/RouteGroup/', rg);
   } 
}  
