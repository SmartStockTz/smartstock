import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
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
import {ActivatedRoute, Router} from '@angular/router';
import {UserDatabaseService} from '../../services/user-database.service';
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

  constructor(private router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private userDatabase: UserDatabaseService,
              private indexDb: NgForage,
              public readonly bottomSheet: MatBottomSheet,
              private snack: MatSnackBar,
              private dialog: MatDialog,
              private stockDatabase: StockDatabaseService) {
    super();
  }

  showProgress = false;
  totalPurchase = 0;
  private stock: Stock;
  private stockDatasourceArray: Stock[];
  units: Observable<UnitsI[]>;
  stockDatasource: MatTableDataSource<Stock>;
  stockColumns = ['product', 'quantity', 'purchase', 'retailPrice', 'wholesalePrice', 'expire', 'action'];
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  searchStockControl = new FormControl();

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
    // const data = this.activatedRoute.snapshot.data;
    // console.log(data);
    this.initializeView();
  }

  private showProgressBar() {
    this.showProgress = true;
  }

  private hideProgressBar() {
    this.showProgress = false;
  }

  private initializeView() {
    this.getStocksFromCache(() => {
    });
  }

  private getStocksFromCache(callback: () => void) {
    // this.searchStockControl.setValue('');
    this.indexDb.getItem<Stock[]>('stocks').then(value => {
      this.stockDatasourceArray = value;
      this.stockDatasource = new MatTableDataSource(this.stockDatasourceArray);
      this.stockDatasource.paginator = this.paginator;
      let sTotal = 0;
      value.forEach(value1 => {
        sTotal += <number>value1.purchase;
      });
      this.totalPurchase = sTotal;
      callback();
    }, error1 => {
      console.log(error1);
      this.snack.open('Failed to get stocks', 'Ok', {duration: 3000});
    });
  }

  // private getSuppliers(supplier: string) {
  //   this.indexDb.getItem<SupplierI[]>('suppliers').then(value => {
  //     const supplierF: SupplierI[] = value.filter(value1 => (value1.name.toLowerCase().includes(supplier.toLowerCase())));
  //     this.suppliers = of(supplierF);
  //   }).catch(reason => {
  //     console.log(reason);
  //     this.snack.open('Failed to get suppliers', 'Ok', {duration: 3000});
  //   });
  // }
  //
  // private getUnits(unit: string) {
  //   this.indexDb.getItem<UnitsI[]>('units').then(value => {
  //     const unitsF: UnitsI[] = value.filter(value1 => (value1.name.toLowerCase().includes(unit.toLowerCase())));
  //     this.units = of(unitsF);
  //   }).catch(reason => {
  //     console.log(reason);
  //     this.snack.open('Failed to get units', 'Ok', {duration: 3000});
  //   });
  // }

  // private getCategory(category: string) {
  //   this.indexDb.getItem<CategoryI[]>('categories').then(value => {
  //     const cateF: CategoryI[] = value.filter(value1 => (value1.name.toLowerCase().includes(category.toLowerCase())));
  //     this.categories = of(cateF);
  //   }).catch(reason => {
  //     console.log(reason);
  //     this.snack.open('Failed to get categories', 'Ok', {duration: 3000});
  //   });
  // }

  editStock(element: Stock) {
    // this.snack.open('Now edit the document and save it', 'Ok', {duration: 3000});
    // this.stock = element;
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
            // update tables
            this.getStocksFromCache(() => {

            });
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
    this.getStocksFromCache(() => {
      this.stockDatasource.filter = query.toString().toLowerCase();
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
