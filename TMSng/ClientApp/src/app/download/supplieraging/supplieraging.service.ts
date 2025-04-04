import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SupplierAgingService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  get(dateUpto: Date) {
    return this.http.get<any[]>(this.apiURL + 'download/SupplierAging/' + formatDate(dateUpto, 'yyyy-MM-dd', 'en-US')) ;
  }
}
