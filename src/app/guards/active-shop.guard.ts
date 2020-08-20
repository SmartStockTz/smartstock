import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {SsmEvents} from '../modules/common-lib/utils/eventsNames';
import {StorageService} from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveShopGuard implements CanActivate {
  constructor(private readonly _storage: StorageService,
              private readonly _router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      try {
        const activeShop = await this._storage.getActiveShop();
        if (activeShop && activeShop.projectId && activeShop.applicationId && activeShop.projectUrlId) {
          resolve(true);
        } else {
          window.dispatchEvent(new Event(SsmEvents.ACTIVE_SHOP_REMOVE));
          this._router.navigateByUrl('/shop').catch(reason => console.log(reason));
          reject(false);
        }
      } catch (e) {
        window.dispatchEvent(new Event(SsmEvents.ACTIVE_SHOP_REMOVE));
        this._router.navigateByUrl('/shop').catch(reason => console.log(reason));
        reject(false);
      }
    });
  }
}
