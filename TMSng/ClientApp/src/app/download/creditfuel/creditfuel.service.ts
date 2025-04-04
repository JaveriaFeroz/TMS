import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CreditFuelService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookup(): Observable<any> {
    return this.http.get<any>(this.apiURL + 'download/CreditFuel/GetLookups');
  }

  get(datefrom: Date, dateto: Date, clientid: number, supplierid: number) {
    return this.http.get<any[]>(this.apiURL + 'download/CreditFuel/' + formatDate(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + formatDate(dateto, 'yyyy-MM-dd', 'en-US') + '/' + clientid + '/' + supplierid);
  }
}
