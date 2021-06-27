import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {RbacService, UserService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {

  constructor(private readonly userDatabase: UserService,
              private readonly rbacService: RbacService,
              private readonly router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.userDatabase.currentUser().then(async user => {
        const hasAccess = await this.rbacService.hasAccess(['admin', 'manager'], state.url);
        const guardAccess = user && user.applicationId && user.projectId && (user.role === 'manager' || user.role === 'admin');
        if (guardAccess || hasAccess) {
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
