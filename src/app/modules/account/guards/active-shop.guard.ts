import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {StorageService} from '@smartstocktz/core-libs';
import {SsmEvents} from '@smartstocktz/core-libs';
import {EventService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})
export class ActiveShopGuard implements CanActivate {
  constructor(private readonly _storage: StorageService,
              private readonly eventService: EventService,
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
          this.eventService.broadcast(SsmEvents.ACTIVE_SHOP_REMOVE);
          this._router.navigateByUrl('/account/shop').catch(reason => console.log(reason));
          reject(false);
        }
      } catch (e) {
        this.eventService.broadcast(SsmEvents.ACTIVE_SHOP_REMOVE);
        this._router.navigateByUrl('/account/shop').catch(reason => console.log(reason));
        reject(false);
      }
    });
  }
}
