import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from './payment';
import { PaymentAllocation } from './paymentallocation';

@Injectable({
  providedIn: 'root'
})

export class PaymentService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiURL + 'finance/Payment/');
  }

  getLookup(): Observable<any> {
    return this.http.get<any>(this.apiURL + 'finance/Payment/GetLookups');
  }

  get(pyNo: string): Observable<Payment> {
    return this.http.get<Payment>(this.apiURL + 'finance/Payment/' + encodeURIComponent(pyNo));
  }

  save(py: Payment) {
    return this.http.post<Payment>(this.apiURL + 'finance/Payment/', py);
  }

  reverse(pyNo: string) {
    return this.http.post<any>(this.apiURL + 'finance/Payment/Reverse/' + encodeURIComponent(pyNo) , null);
  }

  getOSPIVs(supplierId: number): Observable<PaymentAllocation[]> {
    return this.http.get<PaymentAllocation[]>(this.apiURL + 'finance/Payment/GetOSPIVs/' + supplierId);
  }

  //knockOff(knokoff: any) {
  //  return this.http.post<any>(this.apiURL + 'finance/Payment/KnockOff/' , knokoff);
  //}
}
