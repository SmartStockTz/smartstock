import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Stock} from '../../model/stock';
import {
  MAT_BOTTOM_SHEET_DATA,
  MAT_DIALOG_DATA,
  MatBottomSheet,
  MatBottomSheetRef,
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatSidenav,
  MatSnackBar,
  MatTableDataSource
} from '@angular/material';
import {Router} from '@angular/router';
import {NgForage} from 'ngforage';
import {UnitsI} from '../../model/UnitsI';
import {StockDatabaseService} from '../../services/stock-database.service';
import {DeviceInfo} from '../../common-components/DeviceInfo';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent extends DeviceInfo implements OnInit {
  private stockFetchProgress = false;

  constructor(private readonly router: Router,
              private readonly indexDb: NgForage,
              public readonly bottomSheet: MatBottomSheet,
              private readonly snack: MatSnackBar,
              private readonly dialog: MatDialog,
              private readonly stockDatabase: StockDatabaseService) {
    super();
  }

  showProgress = false;
  totalPurchase: Observable<number> = of(0);
  units: Observable<UnitsI[]>;
  stockDatasource: MatTableDataSource<Stock>;
  stockColumns = ['product', 'quantity', 'purchase', 'retailPrice', 'wholesalePrice', 'expire', 'action'];
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  static getSqlDate(date: any): string {
    try {
      const year = date.getFullYear();
      let month = (date.getMonth() + 1).toString(10);
      let day = (date.getDate()).toString(10);
      if (month.length === 1) {
        month = '0'.concat(month);
      }
      if (day.length === 1) {
        day = '0'.concat(day);
      }
      return year + '-' + month + '-' + day;
    } catch (e) {
      console.log('date has an error : ' + e);
      return date;
    }
  }

  ngOnInit() {
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
    this.indexDb.getItem<Stock[]>('stocks').then(stocks => {
      this.stockDatasource = new MatTableDataSource(stocks);
      this.stockDatasource.paginator = this.paginator;
      this._getTotalPurchaseOfStock(stocks);
      this.stockFetchProgress = false;
      if (callback) {
        callback(null);
      }
    }).catch(error1 => {
      this.stockFetchProgress = false;
      console.log(error1);
      this.snack.open('Failed to get stocks', 'Ok', {duration: 3000});
      if (callback) {
        callback(error1);
      }
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
        this.stockDatabase.deleteStock(element, value1 => {
          if (value1 === null) {
            this.snack.open('Product is not deleted successful, try again', 'Ok', {duration: 3000});
            this.hideProgressBar();
          } else {
            this.snack.open('Product successful deleted', 'Ok', {duration: 3000});
            this.hideProgressBar();
            // update table
            this._removeProductFromTable(element);
          }
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

  handleSearch(query: string) {
    if (query) {
      this.stockDatasource.filter = query.toString().toLowerCase();
    } else {
      this.stockDatasource.filter = '';
    }
    // this.getStocksFromCache(() => {
    //   this.stockDatasource.filter = query.toString().toLowerCase();
    // });
  }

  private _removeProductFromTable(element: Stock) {
    this.stockDatasource.data = this.stockDatasource.data.filter(value => value.objectId !== element.objectId);
    this._getTotalPurchaseOfStock(this.stockDatasource.data);
    // update stocks
    this.indexDb.getItem<Stock[]>('stocks').then(stocks => {
      const updatedStock = stocks.filter(value => value.objectId !== element.objectId);
      this.indexDb.setItem('stocks', updatedStock).catch(reason => console.warn('Fails to update stock due to deleted item'));
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
