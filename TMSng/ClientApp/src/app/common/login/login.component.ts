import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../helper/service/auth.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Login } from './login';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements AfterViewInit {
  model: Login = { UserId: null, UserName: null, Password: null, CompanyId: null };
  errorMessage: string;
  UserAccess: any = {};
  ngAfterViewInit() { }
  constructor(private router: Router, private svcLogin: LoginService, private auth: AuthService,
    private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
  }

  ngOnInit() {
    sessionStorage.clear();
  }

  login() {
    if (!this.model.UserId || !this.model.Password) {
      this.svcToaster.showWarning('Please enter valid User Id & Password');
      return;
    }

    // Open wait dialog before authentication
    this.svcWaitDlg.open({});

    this.svcLogin.authenticate(this.model)
      .subscribe({
        next: (data) => {
          console.log('Full Authentication Response:', data);

          // Always close wait dialog
          this.svcWaitDlg.close();

          if (data.message === "Successful") {
            console.log('Authentication successful, token received');

            // Retain token
            this.auth.retainToken(data.accessToken);

            // Fetch user data and navigate
            this.getUserMenuAndAccess()
              .then(() => {
                console.log('User data fetched, attempting navigation');
                this.router.navigate(['/MainForm'])
                  .then(
                    success => console.log('Navigation to MainForm successful'),
                    navigationError => {
                      console.error('Navigation to MainForm failed:', navigationError);
                      this.svcToaster.showFailure('Could not navigate to main page');
                    }
                  );
              })
              .catch(fetchError => {
                console.error('Failed to fetch user data:', fetchError);
                this.svcToaster.showFailure('Could not retrieve user information');
              });
          } else {
            console.warn('Authentication failed:', data.message);
            this.svcToaster.showFailure(data.message || 'Authentication failed');
          }
        },
        error: (error) => {
          console.error('Authentication request error:', error);

          // Always close wait dialog
          this.svcWaitDlg.close();

          this.svcToaster.showFailure(error.message || 'Unable to authenticate');
        }
      });
  }  //login() {
  //  if (this.model.UserId && this.model.Password) {
  //    localStorage.setItem("UserId", JSON.stringify(this.model.UserId));
  //    localStorage.setItem("Password", JSON.stringify(this.model.Password));
  //    this.svcWaitDlg.open({});
  //    this.svcLogin.authenticate(this.model)
  //      .subscribe(
  //      data => {
  //        this.svcWaitDlg.close();
  //        switch (data.message) {
  //          case "Successful":
  //            this.auth.retainToken(data.accessToken)
  //            this.getUserMenuAndAccess().then(() =>
  //              this.router.navigate(['/MainForm'])
  //            );
  //            break;
  //          case "InvalidUserId":
  //            this.svcToaster.showFailure('The user id you have entered is invalid');
  //            break;
  //          case "UserIdDisabled":
  //            this.svcToaster.showFailure('The user id you have entered has been disabled. Please contact your System Admin for further details');
  //            break;
  //          case "InvalidPassword":
  //            this.svcToaster.showFailure('The Password you have entered is invalid');
  //            break;
  //          case "ForcePasswordChange":
  //            this.router.navigate(['/ChangePassword']);
  //            break;
  //        }
  //      },
  //        error => { this.svcToaster.showFailure(error); },
  //        () => { this.svcWaitDlg.close(); });
  //  }
  //  else {
  //    this.svcToaster.showWarning('Please enter valid User Id & Password before proceeding with Login process!');
  //  }
  //};

  tbForogotPwd(): void {
    try {
      if (!this.model.UserId) {
        this.svcToaster.showWarning('Please enter valid User Id before hitting Forgot Password button!');
      }
      else {
        this.svcWaitDlg.open({});
        this.svcLogin.sendPassword(this.model.UserId).subscribe(r => {
          if (r) {
            this.svcToaster.showSuccess(r.message);
          }
        },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); });
      }
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/MainForm']);
  }

  async getUserMenuAndAccess() {
    return new Promise((resolve, reject) => {
      try {
        // Log start of method
        console.log('Starting getUserMenuAndAccess');

        // Fetch all required data
        const _userAccess = this.svcLogin.getAccess();
        const _userMenu = this.svcLogin.getMenu();
        const _company = this.svcLogin.getAllowedCompanies();
        const _userRole = this.svcLogin.getUserRole();
        const _companyconfig = this.svcLogin.getCompanyConfig();

        // Log if any observable is null or undefined
        if (!_userAccess || !_userMenu || !_company || !_userRole || !_companyconfig) {
          console.error('One or more data sources are null or undefined');
          reject(new Error('Invalid data sources'));
          return;
        }

        // Use forkJoin to fetch all data concurrently
        forkJoin([_userAccess, _userMenu, _company, _userRole, _companyconfig])
          .subscribe({
            next: (results) => {
              console.log('User data fetched successfully', results);

              // Validate results before storing
              if (results && results.length === 5) {
                try {
                  sessionStorage.setItem("UserAccess", JSON.stringify(results[0]));
                  sessionStorage.setItem("UserMenu", JSON.stringify(results[1]));
                  sessionStorage.setItem("Company", JSON.stringify(results[2]));
                  sessionStorage.setItem("UserRole", JSON.stringify(results[3]));
                  sessionStorage.setItem("CompanyConfig", JSON.stringify(results[4]));

                  console.log('All user data stored in sessionStorage');
                  resolve(true);
                } catch (storageError) {
                  console.error('Error storing data in sessionStorage', storageError);
                  reject(storageError);
                }
              } else {
                console.error('Unexpected results format', results);
                reject(new Error('Unexpected data format'));
              }
            },
            error: (error) => {
              console.error('Detailed error fetching user data', error);
              this.svcToaster.showFailure('Could not retrieve user data');
              reject(error);
            }
          });
      }
      catch (ex) {
        console.error('Critical exception in getUserMenuAndAccess', ex);
        this.svcToaster.showFailure('Unexpected error during login');
        reject(ex);
      }
    });
  }
//  async getUserMenuAndAccess() {
//    return new Promise((resolve, reject) => {
//      try {
//        let _userAccess = this.svcLogin.getAccess();
//        let _userMenu = this.svcLogin.getMenu();
//        let _company = this.svcLogin.getAllowedCompanies();
//        let _userRole = this.svcLogin.getUserRole();
//        let _companyconfig = this.svcLogin.getCompanyConfig();
//        forkJoin([_userAccess, _userMenu, _company, _userRole, _companyconfig]).subscribe(results => {
//          sessionStorage.setItem("UserAccess", JSON.stringify(results[0]));
//          sessionStorage.setItem("UserMenu", JSON.stringify(results[1]));
//          sessionStorage.setItem("Company", JSON.stringify(results[2]));
//          sessionStorage.setItem("UserRole", JSON.stringify(results[3]));
//          sessionStorage.setItem("CompanyConfig", JSON.stringify(results[4]));
//          resolve(true);
//        });
//      }
//      catch (ex) {
//        reject(ex);
//      }
//    });
//  }
}
