import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserDatabaseService} from '../services/user-database.service';

@Injectable({
  providedIn: 'root'
})
export class AdminRoleGuard implements CanActivate {

  constructor(private readonly router: Router,
              private readonly userDatabase: UserDatabaseService) {
  }

  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UserI | Observable<UserI> | Promise<UserI> {
  //   return new Promise((resolve1, reject) => {
  //     this.userDatabase.currentUser(value => {
  //       if (value) {
  //         resolve1(value);
  //       } else {
  //         reject(null);
  //       }
  //     });
  //   });
  // }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.userDatabase.currentUser(user => {
        if (user && user.role === 'admin') {
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
