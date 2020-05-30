import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {StorageService} from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedUserGuard implements CanActivate {
  constructor(private readonly userDatabase: StorageService,
              private readonly router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.userDatabase.getActiveUser().then(value => {
        if (value && value.applicationId && value.projectUrlId && value.projectId && value.role === 'admin') {
          this.router.navigateByUrl('/dashboard').catch(reason => console.log(reason));
          // reject(false);
        } else if (value && value.applicationId && value.projectUrlId && value.projectId && value.role === 'user') {
          this.router.navigateByUrl('/sale/report').catch(reason => console.log(reason));
          // reject(false);
        } else if (value && value.applicationId && value.projectUrlId && value.projectId && value.role === 'manager') {
          this.router.navigateByUrl('/sale/report').catch(reason => console.log(reason));
          // reject(false);
        } else {
          resolve(true);
        }
      }).catch(_ => {
        this.router.navigateByUrl('/login').catch(reason => console.log(reason));
        reject(false);
      });
    });
  }

}
