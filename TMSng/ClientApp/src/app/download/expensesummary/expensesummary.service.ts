import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ExpenseSummary } from './expensesummary'

@Injectable({
  providedIn: 'root'
})

export class ExpenseSummaryService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  get(datefrom: Date, dateto: Date, dateBasisId: number) {
    return this.http.get<any[]>(this.apiURL + 'download/ExpenseSummary/' + formatDate(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + formatDate(dateto, 'yyyy-MM-dd', 'en-US')   + '/' + dateBasisId);
  }
}
