import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
  constructor(private myRoute: Router) { }
  retainToken(token: string) {
    sessionStorage.setItem("AccessToken", token);
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    sessionStorage.setItem("UserId", decodedToken.sub);
    sessionStorage.setItem("UserName", decodedToken.given_name);
    sessionStorage.setItem("CompanyId", decodedToken.gender);
    // Other functions
    //const expirationDate = helper.getTokenExpirationDate(data.accessToken);
    //const isExpired = helper.isTokenExpired(data.accessToken);
  }

  getToken() {
    return sessionStorage.getItem("AccessToken");
  }

  getUserId() {
    return sessionStorage.getItem("UserId");
  }

  getUserName() {
    return sessionStorage.getItem("UserName");
  }

  getCompany() {
    return sessionStorage.getItem("CompanyId");
    //var CompanyId = JSON.parse(sessionStorage.getItem("CompanyId"));


    //sessionStorage.removeItem("CompanyId");
    //sessionStorage.setItem("CompanyId", CompanyId);
    //return CompanyId;

    // return sessionStorage.getItem("CompanyId");
  }
  getUserRole() {
    return sessionStorage.getItem("UserRole");
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }
  isTokenValid() {
    const helper = new JwtHelperService();
    return !helper.isTokenExpired(this.getToken());
  }
  logout() {
    sessionStorage.clear();
    //this.myRoute.navigate(["/login"]);
  }
}
