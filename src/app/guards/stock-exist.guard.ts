import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {NgForage} from 'ngforage';
import { MatDialog } from '@angular/material/dialog';
import {NoStockDialogComponent} from '../common-components/no-stock-dialog/no-stock-dialog.component';
import {UserDatabaseService} from '../services/user-database.service';

@Injectable({
  providedIn: 'root'
})
export class StockExistGuard implements CanActivate {
  constructor(private readonly indexDb: NgForage,
              private readonly _userApi: UserDatabaseService,
              private readonly dialog: MatDialog) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this._userApi.currentUser();
        const stocks = await this.indexDb.getItem('stocks');
        if (user.role === 'user') {
          resolve(true);
        } else if (stocks && Array.isArray(stocks) && stocks.length > 0) {
          resolve(true);
        } else {
          this.dialog.open(NoStockDialogComponent).afterClosed();
          resolve(false);
        }
      } catch (e) {
        console.log(e);
        resolve(false);
      }
    });
  }
}
