import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JV } from './jv';

@Injectable({ providedIn: 'root' })

export class JVService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getVouchers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiURL + 'finance/JV/');
  }

  getLookup(): Observable<any> {
    return this.http.get<any>(this.apiURL + 'finance/JV/GetLookups');
  }

  get(voucherNo: string): Observable<JV> {
    return this.http.get<JV>(this.apiURL + 'finance/JV/' + encodeURIComponent(voucherNo));
  }

  save(jv: JV) {
    return this.http.post<JV>(this.apiURL + 'finance/JV/', jv);
  }

  reverse(voucherNo: string) {
    return this.http.post<string>(this.apiURL + 'finance/JV/Reverse/' + encodeURIComponent(voucherNo), null);
  }
}  
