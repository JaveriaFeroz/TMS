import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Receipt } from './receipt';
import { ReceiptAllocation } from './receiptallocation';

@Injectable({providedIn: 'root'})

export class ReceiptService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getReceipts(): Observable<Receipt[]> {
    return this.http.get<Receipt[]>(this.apiURL + 'finance/Receipt/');
  }

  getLookup(): Observable<any> {
    return this.http.get<any>(this.apiURL + 'finance/Receipt/GetLookups');
  }

  get(receiptNo: string): Observable<Receipt> {
    return this.http.get<Receipt>(this.apiURL + 'finance/Receipt/' + encodeURIComponent(receiptNo));
  }

  save(receipt: Receipt) {
    return this.http.post<Receipt>(this.apiURL + 'finance/Receipt/', receipt);
  }

  reverse(receiptNo: string) {
    return this.http.post<any>(this.apiURL + 'finance/Receipt/Reverse/' + encodeURIComponent(receiptNo), null);
  }

  getOSInvoices(clientId: number): Observable<ReceiptAllocation[]>{
    return this.http.get<ReceiptAllocation[]>(this.apiURL + 'finance/Receipt/GetOSInvoices/' + clientId);
  }
}
