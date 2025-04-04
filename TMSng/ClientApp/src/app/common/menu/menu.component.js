"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuComponent = void 0;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const login_1 = require("../login/login");
let MenuComponent = class MenuComponent {
    constructor(router, toast, auth, loginSvc) {
        this.router = router;
        this.toast = toast;
        this.auth = auth;
        this.loginSvc = loginSvc;
        this.model = {};
    }
    ngOnInit() {
        this.model.UserName = this.auth.getUserName();
        this.MenuAccess = JSON.parse(sessionStorage.getItem("UserMenu"));
        this.Company = JSON.parse(sessionStorage.getItem("Company"));
        this.model.CompanyId = parseInt(this.auth.getCompany());
        //  return this.Company.find(dt => { return dt.companyId == this.model.CompanyId; }).companyName;
    }
    onChange(event) {
        this.loginSvc.setUserCompany(event).subscribe(() => {
            let _login = new login_1.Login();
            _login.UserId = sessionStorage.getItem("UserId").toString();
            _login.UserName = sessionStorage.getItem("UserName").toString();
            _login.CompanyId = event;
            this.loginSvc.reIssueToken(_login).subscribe(data => {
                sessionStorage.setItem("AccessToken", data.accessToken);
                sessionStorage.setItem("CompanyId", event);
                let _companyconfig = this.loginSvc.getCompanyConfig();
                rxjs_1.forkJoin([_companyconfig]).subscribe(results => {
                    sessionStorage.setItem("CompanyConfig", JSON.stringify(results[0]));
                });
            });
        });
    }
    LogOut() {
        this.auth.logout();
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login']);
    }
};
MenuComponent = __decorate([
    core_1.Component({
        selector: 'app-Menu',
        templateUrl: './menu.component.html',
        styleUrls: ['./menu.component.css']
    })
], MenuComponent);
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map