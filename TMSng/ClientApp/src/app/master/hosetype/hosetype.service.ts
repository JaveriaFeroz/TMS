import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HoseType } from './hosetype';

@Injectable({
  providedIn: 'root'
})

export class HoseTypeService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }  

  getHoseTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiURL + 'master/HoseType/');
  }

  get(hosetypeId: number): Observable<HoseType> {    
    return this.http.get<HoseType>(this.apiURL + 'master/HoseType/' + hosetypeId);  
  }

  save(hosetype: HoseType) { 
    return this.http.post<HoseType>(this.apiURL + 'master/HoseType/', hosetype);  
  }  
}
