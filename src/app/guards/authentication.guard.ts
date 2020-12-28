import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly userDatabase: UserService,
              private readonly router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.userDatabase.currentUser().then(user => {
        if (user && user.applicationId && user.projectId && user.role) {
          resolve(true);
        } else {
          this.userDatabase.updateCurrentUser(null).catch(_ => {
          });
          this.router.navigateByUrl('/account/login').catch(reason => console.log(reason));
          reject(false);
        }
      });
    });
  }

}
