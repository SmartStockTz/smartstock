import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminRoleGuard implements CanActivate {

  constructor(private readonly router: Router,
              private readonly userDatabase: UserService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.userDatabase.currentUser().then(user => {
        if (user && user.applicationId && user.projectUrlId && user.projectId && user.role === 'admin') {
          resolve(true);
        } else {
          this.router.navigateByUrl('/account/login').catch(reason => console.log(reason));
          reject(false);
        }
      }).catch(_ => {
        this.router.navigateByUrl('/account/login').catch(reason => console.log(reason));
        reject(false);
      });
    });
  }

}
