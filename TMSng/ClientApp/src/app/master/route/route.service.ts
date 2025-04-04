import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Route } from './route';
 @Injectable({  
  providedIn: 'root'  
})  
  
export class RouteService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getRoutes(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Route/');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'master/Route/GetLookups');
   }

   get(routeId: number): Observable<Route> {
     return this.http.get<Route>(this.apiURL + 'master/Route/' + routeId);
   }

   save(route: Route) {
     return this.http.post<Route>(this.apiURL + 'master/Route/', route);
   } 
}  
