import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserDatabaseService} from '../services/user-database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly userDatabase: UserDatabaseService,
              private readonly router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.userDatabase.currentUser(user => {
        if (user) {
          next.data = user;
          resolve(true);
        } else {
          this.router.navigateByUrl('/login').catch(reason => console.log(reason));
          reject(false);
        }
      });
    });
  }

}