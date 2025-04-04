import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetDocument } from './assetdocument';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class AssetDocumentService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getAssets(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/AssetDocument/' );
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'master/AssetDocument/GetLookups');
   }

   get(assetId: number): Observable<AssetDocument> {
     return this.http.get<AssetDocument>(this.apiURL + 'master/AssetDocument/' + assetId);
   }

   save(vd: AssetDocument) {
     return this.http.post<AssetDocument>(this.apiURL + 'master/AssetDocument/', vd);
   } 
}  
