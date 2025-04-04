"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const core_1 = require("@angular/core");
const angular_jwt_1 = require("@auth0/angular-jwt");
let AuthService = class AuthService {
    constructor(myRoute) {
        this.myRoute = myRoute;
    }
    retainToken(token) {
        sessionStorage.setItem("AccessToken", token);
        const helper = new angular_jwt_1.JwtHelperService();
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
        sessionStorage.getItem("UserRole");
    }
    isLoggedIn() {
        return this.getToken() !== null;
    }
    isTokenValid() {
        const helper = new angular_jwt_1.JwtHelperService();
        return !helper.isTokenExpired(this.getToken());
    }
    logout() {
        sessionStorage.clear();
        //this.myRoute.navigate(["/login"]);
    }
};
AuthService = __decorate([
    core_1.Injectable()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map