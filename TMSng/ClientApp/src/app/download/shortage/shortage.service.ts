import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ShortageService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookup(): Observable<any> {
    return this.http.get<any>(this.apiURL + 'download/Shortage/GetLookups');
  }

  get(periodFromId: number, periodToId: number, clientId: number, assetId: number) {
    return this.http.get<any[]>(this.apiURL + 'download/Shortage/' + periodFromId + '/' + periodToId + '/' + clientId + '/' + assetId);
  }
}
