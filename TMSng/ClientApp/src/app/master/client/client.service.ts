import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from './client';
 @Injectable({  
  providedIn: 'root'  
})  
  
export class ClientService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getClients(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/Client/');
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'master/Client/GetLookups');
   }

   get(clientId: number): Observable<Client> {
     return this.http.get<Client>(this.apiURL + 'master/Client/' + clientId);
   }

   save(client: Client) {
     return this.http.post<Client>(this.apiURL + 'master/Client/', client);
   } 
}  
