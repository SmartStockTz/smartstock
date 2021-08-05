import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '@smartstocktz/core-libs';
import {bfast} from 'bfastjs';
import {SaleService} from '@smartstocktz/sales';
import {StockService} from '@smartstocktz/stocks';

@Injectable({
  providedIn: 'root'
})
export class ActiveShopGuard implements CanActivate {
  constructor(private readonly userService: UserService,
              private readonly saleService: SaleService,
              private readonly stockService: StockService,
              private readonly router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      try {
        const activeShop = await this.userService.getCurrentShop();
        if (activeShop && activeShop.projectId && activeShop.applicationId) {
          bfast.init({
            applicationId: 'smartstock_lb',
            projectId: 'smartstock'
          });
          bfast.init({
            applicationId: activeShop.applicationId,
            projectId: activeShop.projectId,
            appPassword: activeShop.masterKey,
            adapters: {
              auth: 'DEFAULT',
              http: 'DEFAULT'
            }
          }, activeShop.projectId);
          this.saleService.startWorker(activeShop).catch(console.log);
          this.stockService.startWorker(activeShop).catch(console.log);
          resolve(true);
        } else {
          this.router.navigateByUrl('/account/shop').catch(reason => console.log(reason));
          reject(false);
        }
      } catch (e) {
        this.router.navigateByUrl('/account/shop').catch(reason => console.log(reason));
        reject(false);
      }
    });
  }
}
