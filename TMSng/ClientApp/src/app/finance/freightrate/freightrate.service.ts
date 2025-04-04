import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FreightRate } from './freightrate';

@Injectable({
  providedIn: 'root'
})

export class FreightRateService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }
   
  get(): Observable<FreightRate> {
    return this.http.get<FreightRate>(this.apiURL + 'finance/FreightRate/');
  }

  save(FR: FreightRate) {
    return this.http.post<FreightRate>(this.apiURL + 'finance/FreightRate/', FR);
  }  
}
