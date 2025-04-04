import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { agFormHelper } from '../agFormHelper';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthGLGuard implements CanActivate {
  constructor(private auth: AuthService,  private myRoute: Router){
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isLoggedIn() && agFormHelper.enableGL()) {
      return true;
    }else{
      this.myRoute.navigate(["notauthorized"]);
      return false;
    }
  }
}
