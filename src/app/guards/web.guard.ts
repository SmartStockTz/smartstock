import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '@smartstocktz/core-libs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebGuard implements CanActivate {

  constructor(private readonly userDatabase: UserService,
              private readonly router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (environment.electron === true) {
      this.router.navigateByUrl('/dashboard').catch();
      return false;
    } else {
      return true;
    }
  }

}
