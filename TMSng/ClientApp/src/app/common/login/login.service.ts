import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Menu } from '../menu/menu';
import { UserOption } from '../menu/useroption';
import { Login } from './login';

@Injectable()
export class LoginService {  
  //listUserOption: UserOption[];
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {   
    this.apiURL = baseUrl;
  } 

  authenticate(model: Login) {
    try {
      return this.http.post<any>(this.apiURL + 'common/token', model);
    }
    catch (exception) {
      alert(exception);
    }
  }

  /*temp function*/
  //private handleError(error: HttpErrorResponse) {
  //  if (error.status === 0) {
  //    // A client-side or network error occurred. Handle it accordingly.
  //    console.error('An error occurred:', error.error);
  //  } else {
  //    // The backend returned an unsuccessful response code.
  //    // The response body may contain clues as to what went wrong.
  //    console.error(
  //      `Backend returned code ${error.status}, ` +
  //      `body was: ${error.error}`);
  //  }
  //  // Return an observable with a user-facing error message.
  //  return throwError(
  //    'Something bad happened; please try again later.');
  //}
  /*end of temp function*/

  //reIssueToken(companyid: number, UserId: string, Password:string ) {
  reIssueToken(model: Login) {
    //return this.http.post<any>(this.apiURL + 'common/token/ReIssue/' + companyid + '/' + UserId + '/'+ Password, null);
    return this.http.post<any>(this.apiURL + 'common/token/ReIssue/', model);
  } 

  getAccess() {
    return this.http.get<UserOption[]>(this.apiURL + 'master/user/GetAccess');
  }

  getMenu() {
    return this.http.get<Menu[]>(this.apiURL + 'master/user/GetMenu');
  }

  getAllowedCompanies() {
    return this.http.get<any[]>(this.apiURL + 'master/company/GetCompanies');
  }

  getUserCompany() {
    return this.http.get<any>(this.apiURL + 'master/user/GetUserCompany');
  }

  getUserRole() {
    return this.http.get<any>(this.apiURL + 'master/user/GetUserRole');
  }

  getCompanyConfig() {
    return this.http.get<any>(this.apiURL + 'master/company/GetCompanyConfig');
  }

  setUserCompany(companyId: number) {
    return this.http.post<number>(this.apiURL + 'master/Company/SetUserCompany/?companyId=' + companyId, null);
  }

  sendPassword(userId: string) {
    return this.http.post<any>(this.apiURL + 'master/user/SendPassword/?userId=' + userId, null);
  }
}
