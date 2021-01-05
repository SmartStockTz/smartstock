import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {bfast} from 'bfastjs';
import {MatDialog} from '@angular/material/dialog';
import {PaymentDialogComponent} from '../components/payment-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class PaymentGuard implements CanActivate {

  constructor(private readonly router: Router,
              private readonly dialog: MatDialog) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      try {
        const cache = bfast.cache({database: 'payment', collection: 'subscription'});
        const status = await cache.get<any>('status', {secure: true});
        if (status && status.subscription === true) {
          resolve(true);
        } else {
          reject(false);
          this.router.navigateByUrl('/account/bill').catch(reason => {
          });
          this.dialog.open(PaymentDialogComponent).afterClosed().subscribe(value => {
            this.router.navigateByUrl('/account/bill').catch(reason => {
            });
          });
        }
      } catch (reason) {
        resolve(true);
      }
    });
  }

}
