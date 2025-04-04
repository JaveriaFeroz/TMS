import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JP } from './jp';
import { JPTrip } from './jptrip';

@Injectable({
  providedIn: 'root'
})

export class JPService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getPayments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiURL + 'finance/JP/');
  }

  getLookup(): Observable<any> {
    return this.http.get<any>(this.apiURL + 'finance/JP/GetLookups');
  }

  get(voucherNo: string): Observable<JP> {
    return this.http.get<JP>(this.apiURL + 'finance/JP/' + encodeURIComponent(voucherNo));
  }

  save(jp: JP) {
    return this.http.post<JP>(this.apiURL + 'finance/JP/', jp);
  }

  reverse(voucherNo: string) {
    return this.http.post<string>(this.apiURL + 'finance/JP/Reverse/' + encodeURIComponent(voucherNo), null);
  }

  getOSTrips(clientId: number, dateFrom: Date, dateTo: Date): Observable<JPTrip[]> {
    return this.http.get<any>(this.apiURL + 'finance/JP/GetOSTrips/' + (clientId == null ? -1 : clientId) + '/' + encodeURIComponent(dateFrom.toString()) + '/' + encodeURIComponent(dateTo.toString()));
  }  
}
