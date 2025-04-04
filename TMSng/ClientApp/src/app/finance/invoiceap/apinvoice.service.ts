import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APInvoice } from './apinvoice';

@Injectable({
  providedIn: 'root'
})

export class APInvoiceService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getPIVs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiURL + 'finance/APInvoice/');
  }

  getLookup(): Observable<any> {
    return this.http.get<any>(this.apiURL + 'finance/APInvoice/GetLookups');
  }

  get(voucherNo: string): Observable<APInvoice> {
    return this.http.get<APInvoice>(this.apiURL + 'finance/APInvoice/' + encodeURIComponent(voucherNo));
  }

  save(piv: APInvoice) {
    return this.http.post<APInvoice>(this.apiURL + 'finance/APInvoice/', piv);
  }

  reverse(voucherNo: string) {
    return this.http.post<any>(this.apiURL + 'finance/APInvoice/Reverse/' + encodeURIComponent(voucherNo), null);
  }

  getOSSlips(supplierId: number, dateFrom: Date, dateTo: Date): Observable<any> {
    return this.http.get<any>(this.apiURL + 'finance/APInvoice/GetOSSlips/' + supplierId + '/' + encodeURIComponent(dateFrom.toString()) + '/' + encodeURIComponent(dateTo.toString()));
  }  
}  
