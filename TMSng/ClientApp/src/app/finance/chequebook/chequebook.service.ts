import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChequeBook } from './chequebook';
import { ChequeBookDetail } from './chequebookdetail';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class ChequeBookService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getBooks(): Observable<ChequeBookDetail[]> {
     return this.http.get<ChequeBookDetail[]>(this.apiURL + 'finance/ChequeBook/');
   }

   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'finance/ChequeBook/GetLookups');
   }

   get(bookId: number): Observable<ChequeBook> {
     return this.http.get<ChequeBook>(this.apiURL + 'finance/ChequeBook/' + bookId);
   }

   save(cb: ChequeBook) {
     return this.http.post<ChequeBook>(this.apiURL + 'finance/ChequeBook/', cb);
   } 
}
