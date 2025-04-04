import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ARInvoice } from './arinvoice';

@Injectable({
  providedIn: 'root'
})

export class ARInvoiceService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(this.apiURL + 'finance/ARInvoice/');
  }

  getLookup(): Observable<any> {
    return this.http.get<any>(this.apiURL + 'finance/ARInvoice/GetLookups');
  }

  get(invoiceNo: string): Observable<ARInvoice> {
    return this.http.get<ARInvoice>(this.apiURL + 'finance/ARInvoice/' + encodeURIComponent(invoiceNo));
  }

  save(invoicear: ARInvoice) {
    return this.http.post<ARInvoice>(this.apiURL + 'finance/ARInvoice/', invoicear);
  }

  reverse(invoiceNo: string) {
    return this.http.post<any>(this.apiURL + 'finance/ARInvoice/Reverse/' + encodeURIComponent(invoiceNo), null);
  }
}  
