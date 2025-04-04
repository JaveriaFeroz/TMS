import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PLSummary } from './plsummary';

@Injectable({  
  providedIn: 'root'  
})  
  
export class PLSummaryService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookup(): Observable<any> {
    return this.http.get<any>(this.apiURL + 'download/Shortage/GetLookups');
  }

  GetRoutePL(datefrom: Date, dateto: Date, jobPeriodId: number, dataBasisId: number) {
    return this.http.get<any[]>(this.apiURL + 'download/PLSummary/GetRoutePL/' + formatDate(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + formatDate(dateto, 'yyyy-MM-dd', 'en-US') + '/' + jobPeriodId + '/' + dataBasisId);
  }

  GetConsigneePL(datefrom: Date, dateto: Date, jobPeriodId: number, dataBasisId: number) {
    return this.http.get<any[]>(this.apiURL + 'download/PLSummary/GetConsigneePL/' + formatDate(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + formatDate(dateto, 'yyyy-MM-dd', 'en-US') + '/' + jobPeriodId + '/' + dataBasisId);
  }
}
