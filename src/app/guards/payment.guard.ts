import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {cache} from 'bfast';

@Injectable({
  providedIn: 'root'
})
export class PaymentGuard implements CanActivate {

  constructor(private readonly router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      try {
        const _cache = cache({database: 'payment', collection: 'subscription'});
        const status = await _cache.get<any>('status');
        if (status && status.subscription === true) {
          resolve(true);
        } else if (status && status.subscription === false) {
          reject(false);
          this.router.navigateByUrl('/account/bill').catch(_ => {
          });
        } else {
          resolve(true);
        }
      } catch (reason) {
        resolve(true);
      }
    });
  }

}
