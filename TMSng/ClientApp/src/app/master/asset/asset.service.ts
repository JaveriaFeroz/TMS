import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from './asset';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class AssetService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getAssets(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Asset/');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'master/Asset/GetLookups');
   }

   get(assetId: number): Observable<Asset> {
     return this.http.get<Asset>(this.apiURL + 'master/Asset/' + assetId);
   }

   save(asset: Asset) {
     return this.http.post<Asset>(this.apiURL + 'master/Asset/', asset);
   } 
}  
