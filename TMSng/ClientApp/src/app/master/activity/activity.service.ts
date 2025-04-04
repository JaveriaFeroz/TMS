import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from './activity';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class ActivityService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getActivities(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Activity/' );
   }

   get(activityId: number): Observable<Activity> {
     return this.http.get<Activity>(this.apiURL + 'master/Activity/' + activityId);
   }

   save(activity: Activity) {
     return this.http.post<Activity>(this.apiURL + 'master/Activity/', activity);
   } 
}  
