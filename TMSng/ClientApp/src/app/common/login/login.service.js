"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const core_1 = require("@angular/core");
let LoginService = class LoginService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    authenticate(model) {
        try {
            return this.http.post(this.apiURL + 'common/token', model);
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
    reIssueToken(model) {
        //return this.http.post<any>(this.apiURL + 'common/token/ReIssue/' + companyid + '/' + UserId + '/'+ Password, null);
        return this.http.post(this.apiURL + 'common/token/ReIssue/', model);
    }
    getAccess() {
        return this.http.get(this.apiURL + 'master/user/GetAccess');
    }
    getMenu() {
        return this.http.get(this.apiURL + 'master/user/GetMenu');
    }
    getAllowedCompanies() {
        return this.http.get(this.apiURL + 'master/company/GetCompanies');
    }
    getUserCompany() {
        return this.http.get(this.apiURL + 'master/user/GetUserCompany');
    }
    getUserRole() {
        return this.http.get(this.apiURL + 'master/user/GetUserRole');
    }
    getCompanyConfig() {
        return this.http.get(this.apiURL + 'master/company/GetCompanyConfig');
    }
    setUserCompany(companyId) {
        return this.http.post(this.apiURL + 'master/Company/SetUserCompany/?companyId=' + companyId, null);
    }
};
LoginService = __decorate([
    core_1.Injectable(),
    __param(1, core_1.Inject('API_BASE_URL'))
], LoginService);
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map