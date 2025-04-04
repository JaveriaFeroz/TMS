import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../helper/service/auth.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { Login } from '../login/login';
import { LoginService } from '../login/login.service';
import { Menu } from './menu';

@Component({
  selector: 'app-Menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent {
  model: any = {};
  MenuAccess: Menu[];
  Company: any[]; 

  constructor(private router: Router, private toast: agToasterService, private auth: AuthService,
    private loginSvc: LoginService) { }

  ngOnInit() {
    this.model.UserName = this.auth.getUserName();
    this.MenuAccess = JSON.parse(sessionStorage.getItem("UserMenu"));
    this.Company = JSON.parse(sessionStorage.getItem("Company"));
    this.model.CompanyId = parseInt(this.auth.getCompany());
  }

  onChange(event) {
    this.loginSvc.setUserCompany(event).subscribe(
      () => {
        let _login: Login = new Login();
        _login.UserId = sessionStorage.getItem("UserId").toString();
        _login.UserName = sessionStorage.getItem("UserName").toString();
        _login.CompanyId = event;
        this.loginSvc.reIssueToken(_login).subscribe(
          data => {
            sessionStorage.setItem("AccessToken", data.accessToken)
            sessionStorage.setItem("CompanyId", event);
            let _companyconfig = this.loginSvc.getCompanyConfig();
            forkJoin([_companyconfig]).subscribe(results => {
              sessionStorage.setItem("CompanyConfig", JSON.stringify(results[0]));
            });
          },
        );
      });
  }

  LogOut() {
    this.auth.logout();
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
