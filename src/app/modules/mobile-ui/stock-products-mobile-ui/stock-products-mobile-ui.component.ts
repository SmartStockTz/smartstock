import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import {Observable, of} from 'rxjs';
import {StorageService} from '../../../services/storage.service';
import {InfoMessageService} from '../../../services/info-message.service';
import {StockState} from '../../stocks/states/stock.state';
import {StockModel} from '../../stocks/models/stock.model';
import {UnitsI} from '../../../model/UnitsI';
import {DialogDeleteComponent} from '../../stocks/components/stock.component';

@Component({
  selector: 'app-stock-products-mobile-ui',
  templateUrl: './stock-products-mobile-ui.component.html',
  styleUrls: ['./stock-products-mobile-ui.component.css']
})
export class StockProductsMobileUiComponent implements OnInit {
  stockFetchProgress = false;

  constructor(private readonly _router: Router,
              private readonly _storage: StorageService,
              public readonly _bottomSheet: MatBottomSheet,
              private readonly _infoMessage: InfoMessageService,
              private readonly _dialog: MatDialog,
              private readonly _stockDatabase: StockState) {
  }

  showProgress = false;
  units: Observable<UnitsI[]>;
  products: Observable<StockModel[]>;

  ngOnInit() {
    window.addEventListener('ssm_stocks_updated', (e) => {
      console.log(e);
      console.log('stock is updated from worker thread check it out');
    });
    this.initializeView();
  }

  private initializeView() {
    this.getStocksFromCache();
  }

  private getStocksFromCache(callback?: (error) => void) {
    this.stockFetchProgress = true;
    this._storage.getStocks().then(stocks => {
      if (!stocks) {
        this.hotReloadStocks();
      } else if (stocks && Array.isArray(stocks) && stocks.length === 0) {
        this.hotReloadStocks();
      } else {
        this.products = of(stocks);
        this.stockFetchProgress = false;
        if (callback) {
          callback(null);
        }
      }
    }).catch(error1 => {
      this.stockFetchProgress = false;
      // this._infoMessage.showMobileInfoMessage('Failed to get stocks from local storage', 3000);
      if (callback) {
        callback(error1);
      }
    });
  }

  hotReloadStocks() {
    this.stockFetchProgress = true;
    this._stockDatabase.getAllStock().then(async stocks => {
      try {
        this.stockFetchProgress = false;
        await this._storage.saveStocks(stocks);
        this.products = of(stocks);
        this.stockFetchProgress = false;
        this._infoMessage.showMobileInfoMessage('Successful retrieve products', 3000);
      } catch (e) {
        throw e;
      }
    }).catch(_ => {
      this.stockFetchProgress = false;
      this._infoMessage.showMobileInfoMessage('Fails to get products from server, try again', 3000);
    });
  }

  editStock(element: StockModel) {
    this._router.navigateByUrl('/stock/edit/' + element.objectId + '?stock=' + encodeURI(JSON.stringify(element)))
      .catch(reason => console.log(reason));
  }

  deleteStock(element: StockModel) {
    const matDialogRef = this._dialog.open(DialogDeleteComponent, {data: element});
    matDialogRef.afterClosed().subscribe(value => {
      if (value === 'no') {
        this._infoMessage.showMobileInfoMessage('Deletion is cancelled', 3000);
      } else {
        this._infoMessage.showMobileInfoMessage('Delete in progress...', 3000);
        this._stockDatabase.deleteStock(element).then(_ => {
          this._infoMessage.showMobileInfoMessage('Product successful deleted', 3000);
          this._removeProductFromTable(element);
        }).catch(reason => {
          console.log(reason);
          this._infoMessage.showMobileInfoMessage('Product is not deleted successful, try again', 3000);
        });
      }
    });
  }

  // viewProduct(stock: StockModel) {
  //   this._bottomSheet.open(StockDetailsComponent, {
  //     data: stock,
  //     closeOnNavigation: true,
  //   });
  // }

  handleSearch(query: string) {
    this._storage.getStocks().then(value => {
      if (value) {
        if (query) {
          const stocksFiltered: StockModel[] = value.filter(value1 => (value1.product.toLowerCase().includes(query.toLowerCase())));
          this.products = of(stocksFiltered);
        } else {
          this.products = of(value);
        }
      } else {
        this._infoMessage.showMobileInfoMessage('No products found, try again', 3000);
      }
    }).catch(reason => {
      console.log(reason);
      this._infoMessage.showMobileInfoMessage(reason, 3000);
    });
  }

  private _removeProductFromTable(element: StockModel) {
    this._storage.getStocks().then(stocks => {
      const updatedStock = stocks.filter(value => value.objectId !== element.objectId);
      this.products = of(updatedStock);
      this._storage.saveStocks(updatedStock).catch(reason => console.warn('Fails to update stock due to deleted item'));
    }).catch(_ => {
      console.warn('fails to update stocks');
    });
  }

  // private _getTotalPurchaseOfStock(stocks: StockModel[]) {
  //   // @ts-ignore
  //   const sum = stocks.reduce(function (a, b) {
  //     return {purchase: a.purchase + b.purchase}; // returns object with property x
  //   });
  //   this.totalPurchase = of(sum.purchase);
  // }

  // reload() {
  //   this.getStocksFromCache(() => {
  //   });
  // }

  exportStock() {
    // this._stockDatabase.exportToExcel().then(_ => {
    //   this.snack.open('Your request received we will send your an email' +
    //     ' contain link to download your stocks', 'Ok', {
    //     duration: 6000
    //   });
    // }).catch(reason => {
    //   console.log(reason);
    //   this.snack.open('Request fails try again later', 'Ok', {
    //     duration: 3000
    //   });
    // });
  }
}
