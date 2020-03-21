import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Stock} from '../../model/stock';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSidenav} from '@angular/material/sidenav';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {UnitsI} from '../../model/UnitsI';
import {StockDatabaseService} from '../../services/stock-database.service';
import {DeviceInfo} from '../../common-components/DeviceInfo';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent extends DeviceInfo implements OnInit {
  selectedTab = 0;
  private stockFetchProgress = false;

  constructor(private readonly router: Router,
              private readonly indexDb: LocalStorageService,
              public readonly bottomSheet: MatBottomSheet,
              private readonly snack: MatSnackBar,
              private readonly dialog: MatDialog,
              private readonly activatedRoute: ActivatedRoute,
              private readonly stockDatabase: StockDatabaseService) {
    super();
  }

  showProgress = false;
  hotReloadProgress = false;
  totalPurchase: Observable<number> = of(0);
  units: Observable<UnitsI[]>;
  stockDatasource: MatTableDataSource<Stock>;
  stockColumns = ['product', 'quantity', 'purchase', 'retailPrice', 'wholesalePrice', 'expire', 'action'];
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(value => {
      if (value) {
        this.selectedTab = Number(value.t);
      }
    });
    window.addEventListener('ssm_stocks_updated', (e) => {
      console.log(e);
      console.log('stock is updated from worker thread check it out');
    });
    this.initializeView();
  }

  private showProgressBar() {
    this.showProgress = true;
  }

  private hideProgressBar() {
    this.showProgress = false;
  }

  private initializeView() {
    this.getStocksFromCache();
  }

  private getStocksFromCache(callback?: (error) => void) {
    this.stockFetchProgress = true;
    this.indexDb.getStocks().then(stocks => {
      if (!stocks && !Array.isArray(stocks)) {
        // stocks = [];
        this.hotReloadStocks();
        throw new Error('Stock not available in localstorage');
      }
      if (stocks && Array.isArray(stocks) && stocks.length === 0) {
        this.hotReloadStocks();
        throw new Error('Stock not available in localstorage');
      }
      this.stockDatasource = new MatTableDataSource(stocks);
      this.stockDatasource.paginator = this.paginator;
      this._getTotalPurchaseOfStock(stocks);
      this.stockFetchProgress = false;
      if (callback) {
        callback(null);
      }
    }).catch(error1 => {
      this.stockFetchProgress = false;
      // console.log(error1);
      this.snack.open('Failed to get stocks from local storage', 'Ok', {duration: 3000});
      if (callback) {
        callback(error1);
      }
    });
  }

  hotReloadStocks() {
    this.hotReloadProgress = true;
    this.stockDatabase.getAllStock().then(async stocks => {
      try {
        this.hotReloadProgress = false;
        await this.indexDb.saveStocks(stocks);
        this.stockDatasource = new MatTableDataSource(stocks);
        this.stockDatasource.paginator = this.paginator;
        this._getTotalPurchaseOfStock(stocks);
        this.stockFetchProgress = false;
        this.snack.open('Successful retrieve stocks from server', 'Ok', {
          duration: 3000
        });
      } catch (e) {
        throw e;
      }
    }).catch(reason => {
      this.hotReloadProgress = false;
      console.log(reason);
      this.snack.open('Fails to get stocks from server, try again', 'Ok', {
        duration: 3000
      });
    });
  }

  editStock(element: Stock) {
    this.router.navigateByUrl('/stock/edit/' + element.objectId + '?stock=' + encodeURI(JSON.stringify(element)))
      .catch(reason => console.log(reason));
  }

  deleteStock(element: Stock) {
    const matDialogRef = this.dialog.open(DialogDeleteComponent, {width: '350', data: element});
    matDialogRef.afterClosed().subscribe(value => {
      if (value === 'no') {
        this.snack.open('Deletion is cancelled', 'Ok', {duration: 3000});
      } else {
        this.showProgressBar();
        this.stockDatabase.deleteStock(element).then(value1 => {
          this.snack.open('Product successful deleted', 'Ok', {duration: 3000});
          this.hideProgressBar();
          // update table
          this._removeProductFromTable(element);
        }).catch(reason => {
          console.log(reason);
          this.snack.open('Product is not deleted successful, try again', 'Ok', {duration: 3000});
          this.hideProgressBar();
        });
      }
    });
  }

  viewProduct(stock: Stock) {
    this.bottomSheet.open(StockDetailsComponent, {
      data: stock,
      closeOnNavigation: true,
    });
  }

  // affect performance

  handleSearch(query: string) {
    this.getStocksFromCache(() => {
      // this.stockDatasource.filter = query.toString().toLowerCase();
      if (query) {
        this.stockDatasource.filter = query.toString().toLowerCase();
      } else {
        this.stockDatasource.filter = '';
      }
    });
  }

  private _removeProductFromTable(element: Stock) {
    this.stockDatasource.data = this.stockDatasource.data.filter(value => value.objectId !== element.objectId);
    this._getTotalPurchaseOfStock(this.stockDatasource.data);
    // update stocks
    this.indexDb.getStocks().then(stocks => {
      const updatedStock = stocks.filter(value => value.objectId !== element.objectId);
      this.indexDb.saveStocks(updatedStock).catch(reason => console.warn('Fails to update stock due to deleted item'));
    }).catch(reason => {
      console.warn('fails to update stocks to to deleted item');
    });
  }

  private _getTotalPurchaseOfStock(stocks: Stock[]) {
    // @ts-ignore
    const sum = stocks.reduce(function (a, b) {
      return {purchase: a.purchase + b.purchase}; // returns object with property x
    });
    this.totalPurchase = of(sum.purchase);
  }

  reload() {
    this.getStocksFromCache(() => {
    });
  }

  exportStock() {
    this.stockDatabase.exportToExcel().then(_ => {
      this.snack.open('Your request received we will send your an email' +
        ' contain link to download your stocks', 'Ok', {
        duration: 6000
      });
    }).catch(reason => {
      console.log(reason);
      this.snack.open('Request fails try again later', 'Ok', {
        duration: 3000
      });
    });
  }
}

@Component({
  selector: 'app-dialog-delete',
  templateUrl: 'app-dialog-delete.html',
})
export class DialogDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Stock) {
  }

  delete(stock: Stock) {
    this.dialogRef.close(stock);
  }

  cancel() {
    this.dialogRef.close('no');
  }
}

@Component({
  selector: 'app-stock-details',
  templateUrl: 'stock-details.html'
})
export class StockDetailsComponent {
  constructor(private _bottomSheetRef: MatBottomSheetRef<StockDetailsComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: Stock) {
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  getStocks() {
    return Object.keys(this.data);
  }
}
