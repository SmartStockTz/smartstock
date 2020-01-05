import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserDatabaseService} from '../services/user-database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedUserGuard implements CanActivate {
  constructor(private readonly userDatabase: UserDatabaseService,
              private readonly router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.userDatabase.currentUser(value => {
        console.log(value);
        if (value && value.role === 'admin') {
          console.log('user is admin');
          this.router.navigateByUrl('/dashboard').catch(reason => console.log(reason));
          reject(false);
        } else if (value && value.role !== 'admin') {
          console.log('user is not admin');
          this.router.navigateByUrl('/sale').catch(reason => console.log(reason));
          reject(false);
        } else {
          console.log('remain where i am');
          resolve(true);
        }
      });
    });
  }

}
