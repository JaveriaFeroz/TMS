import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OPSSummary } from './opssummary';

@Injectable({
  providedIn: 'root'
})

export class OPSSummaryService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  get(datefrom: Date, dateto: Date) {
    return this.http.get<any[]>(this.apiURL + 'download/OpsSummary/' + formatDate(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + formatDate(dateto, 'yyyy-MM-dd', 'en-US'));
  }
}
