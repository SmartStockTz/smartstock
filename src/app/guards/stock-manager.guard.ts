import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserDatabaseService} from '../services/user-database.service';

@Injectable({
  providedIn: 'root'
})
export class StockManagerGuard implements CanActivate {

  constructor(private readonly userDatabase: UserDatabaseService,
              private readonly router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.userDatabase.currentUser().then(user => {
        if (user && user.applicationId && user.projectUrlId && user.projectId && user.role === 'manager') {
          resolve(true);
        } else {
          this.router.navigateByUrl('/login').catch(reason => console.log(reason));
          reject(false);
        }
      }).catch(_ => {
        this.router.navigateByUrl('/login').catch(reason => console.log(reason));
        reject(false);
      });
    });
  }

}
