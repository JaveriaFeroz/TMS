import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetSwap } from './assetswap';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class AssetSwapService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'operation/AssetSwap/GetLookups');
   }

   save(assetswap: AssetSwap) {
     return this.http.post<AssetSwap>(this.apiURL + 'operation/AssetSwap/', assetswap);
   } 
}  
