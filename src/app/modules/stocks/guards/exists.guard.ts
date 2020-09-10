import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../../account/services/user.service';
import {StorageService} from '../../lib/services/storage.service';
import {NoStockDialogComponent} from '../../lib/components/no-stock-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ExistsGuard implements CanActivate {
  constructor(private readonly indexDb: StorageService,
              private readonly _userApi: UserService,
              private readonly dialog: MatDialog) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this._userApi.currentUser();
        const stocks = await this.indexDb.getStocks();
        if (user.role === 'user') {
          resolve(true);
        } else if (stocks && Array.isArray(stocks) && stocks.length > 0) {
          resolve(true);
        } else {
          this.dialog.open(NoStockDialogComponent).afterClosed();
          resolve(false);
        }
      } catch (e) {
       // console.log(e);
        resolve(false);
      }
    });
  }
}
