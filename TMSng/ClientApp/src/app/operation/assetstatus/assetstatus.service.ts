import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from '../../master/asset/asset';
import { AssetStatus } from './assetstatus';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class AssetStatusService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getAssets(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Asset');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'master/Asset/GetLookups');
   }

   get(assetNo: string): Observable<AssetStatus> {
     return this.http.get<AssetStatus>(this.apiURL + 'master/Asset/GetStatus/' + assetNo);
   }

   save(AssetId: number, statusId: number, newstatusId: number, reason: string) {
     return this.http.post<any>(this.apiURL + 'master/Asset/SaveStatus/' + AssetId + '/' + statusId + '/' + newstatusId + '/' +reason, null);
   } 
}  
