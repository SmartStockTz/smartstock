import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {UserI} from '../model/UserI';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {Stock} from '../model/stock';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSidenav, MatSnackBar, MatTableDataSource} from '@angular/material';
import {CashSaleI} from '../model/CashSale';
import {Router} from '@angular/router';
import {UserDatabaseService} from '../services/user-database.service';
import {NgForage} from 'ngforage';
import {SalesDatabaseService} from '../services/sales-database.service';
import {CategoryI} from '../model/CategoryI';
import {SupplierI} from '../model/SupplierI';
import {UnitsI} from '../model/UnitsI';
import {StockDatabaseService} from '../services/stock-database.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  private currentUser: UserI;
  isAdmin = false;
  isLogin = false;
  showProgress = false;
  totalPrice = 0;
  priceUnit = 0;
  totalPurchase = 0;
  showRetailProfit = 0;
  wholesaleProfit = 0;
  totalQuantity = 0;
  productNameControlInput = new FormControl();
  receiveControlInput = new FormControl();
  quantityControlInput = new FormControl();
  discountControlInput = new FormControl();
  searchSaleControl = new FormControl();
  retailWholesaleRadioInput = new FormControl();
  traRadioControl = new FormControl();
  nhifRadioInput = new FormControl();
  private stocks: Stock[];
  private stock: Stock;
  private stockDatasourceArray: Stock[];
  categories: Observable<CategoryI[]>;
  suppliers: Observable<SupplierI[]>;
  units: Observable<UnitsI[]>;
  stockDatasource: MatTableDataSource<Stock>;
  private saleDatasourceArray: CashSaleI[];
  salesDatasource: MatTableDataSource<CashSaleI>;
  stockColums = ['product', 'category', 'supplier', 'quantity', 'wholesaleQuantity', 'purchase', 'retailPrice',
    'retailWholesalePrice', 'nhifPrice', 'expire', 'action'];
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchStockControl = new FormControl();
  wholesaleQuantityControlInput = new FormControl();
  purchasePriceControlInput = new FormControl();
  retailPriceControlInput = new FormControl();
  retailWholesalePriceControlInput = new FormControl();
  wholesalePriceControlInput = new FormControl();
  reorderControlInput = new FormControl();
  nhifPriceControlInput = new FormControl();
  categoryControlInput = new FormControl();
  supplierControlInput = new FormControl();
  unitsControlInput = new FormControl();
  shelfControlInput = new FormControl();
  expireDateControlInput = new FormControl();

  constructor(private router: Router,
              private userDatabase: UserDatabaseService,
              private indexDb: NgForage,
              private snack: MatSnackBar,
              private dialog: MatDialog,
              private stockDatabase: StockDatabaseService,
              private saleDatabase: SalesDatabaseService) {
  }

  ngOnInit() {
    this.indexDb.getItem<UserI>('user').then(value => {
      if (value === null) {
        this.isLogin = false;
        this.router.navigateByUrl('login').catch(reason => console.log(reason));
      } else {
        this.isAdmin = value.role === 'admin';
        this.isLogin = true;
        this.currentUser = value;
        // control input initialize
        this.initializeView();
      }
    }).catch(reason => {
      console.log(reason);
    });
  }

  openDrawer() {
    this.sidenav.open().catch(reason => {
      console.log(reason.toString());
    });
  }

  home() {
    this.router.navigateByUrl('').catch(reason => {
      console.log(reason.toString());
    });
  }

  logout() {
    this.userDatabase.logout().then(value => {
      this.router.navigateByUrl('').catch(reason => console.log(reason));
    }).catch(reason => {
      console.log(reason);
    });
  }

  addNewStock() {
    if (this.productNameControlInput.value === null) {
      this.snack.open('Please enter a product name', 'Ok', {duration: 3000});
    } else if (this.categoryControlInput.value === null) {
      this.snack.open('Please enter category', 'Ok', {duration: 3000});
    } else if (this.supplierControlInput.value === null) {
      this.snack.open('Please enter supplier', 'Ok', {duration: 3000});
    } else if (this.unitsControlInput.value === null) {
      this.snack.open('Please enter unit', 'Ok', {duration: 3000});
    } else if (<number>this.quantityControlInput.value === null) {
      this.snack.open('Please enter quantity and must be positive number', 'Ok', {duration: 3000});
    } else if (<number>this.wholesaleQuantityControlInput.value === null || <number>this.wholesaleQuantityControlInput.value < 0) {
      this.snack.open('Please enter wholesale quantity and must be positive number', 'Ok', {duration: 3000});
    } else if (<number>this.purchasePriceControlInput.value === null || <number>this.purchasePriceControlInput.value < 0) {
      this.snack.open('Please enter purchase price and must be positive number', 'Ok', {duration: 3000});
    } else if (<number>this.retailPriceControlInput.value === null || <number>this.retailPriceControlInput.value < 0) {
      this.snack.open('Please enter retail price and must be positive', 'Ok', {duration: 3000});
    } else if (<number>this.retailWholesalePriceControlInput.value === null || <number>this.retailWholesalePriceControlInput.value < 0) {
      this.snack.open('Please enter retail wholesale price and must be positive', 'Ok', {duration: 3000});
    } else if (<number>this.wholesalePriceControlInput.value === null || <number>this.wholesalePriceControlInput.value < 0) {
      this.snack.open('Please enter wholesale price and must be positive', 'Ok', {duration: 3000});
    } else if (<number>this.nhifPriceControlInput.value === null || <number>this.nhifPriceControlInput.value < 0) {
      this.snack.open('Please enter nhif price and must be positive', 'Ok', {duration: 3000});
    } else if (<number>this.reorderControlInput.value === null || <number>this.reorderControlInput.value < 0) {
      this.snack.open('Please enter reorder level and must be positive', 'Ok', {duration: 3000});
    } else if (this.shelfControlInput.value === null) {
      this.snack.open('Please enter shelf location', 'Ok', {duration: 3000});
    } else if (this.expireDateControlInput.value === null) {
      this.snack.open('Please enter expire date of the product', 'Ok', {duration: 3000});
    } else {
      this.showProgressBar();
      let idV: string;
      if (this.stock === null) {
        idV = 'newS';
      } else if (this.stock === undefined) {
        idV = 'newS';
      } else {
        idV = this.stock.id;
      }
      this.stockDatabase.addStock({
        product: this.productNameControlInput.value,
        id: idV,
        wholesalePrice: this.wholesalePriceControlInput.value,
        unit: this.unitsControlInput.value,
        wholesaleQuantity: this.wholesaleQuantityControlInput.value,
        retailPrice: this.retailPriceControlInput.value,
        category: this.categoryControlInput.value,
        shelf: this.shelfControlInput.value,
        retailWholesalePrice: this.retailWholesalePriceControlInput.value,
        nhifPrice: this.nhifPriceControlInput.value,
        profit: (<number>this.retailPriceControlInput.value - <number>this.purchasePriceControlInput.value),
        purchase: this.purchasePriceControlInput.value,
        quantity: this.quantityControlInput.value,
        reorder: this.reorderControlInput.value,
        supplier: this.supplierControlInput.value,
        q_status: '',
        times: (<number>this.retailPriceControlInput.value / <number>this.purchasePriceControlInput.value),
        expire: this.getSqlDate(<Date>this.expireDateControlInput.value),
        retail_stockcol: ''
      }, value => {
        if (value === null) {
          this.snack.open('Stock is not added, try again or contact support', 'Ok');
          this.hideProgressBar();
        } else {
          this.hideProgressBar();
          this.clearInputs();
          this.stock = null;
          console.log(value);

          // get stocks from cache
          this.getStocksFromCache();
        }
      });
    }
  }

  // removeItemFromCart(element: CartI) {
  //   const cartIS = this.stockDatasourceArray.filter(value => value !== element);
  //   this.stockDatasourceArray = cartIS;
  //   this.stockDatasource = new MatTableDataSource(this.stockDatasourceArray);
  //   this.updateTotalBill();
  // }
  //
  // updateSelectedStock(st: Stock) {
  //   this.stock = st;
  //   this.showTotalPrice();
  // }

  // submitBill() {
  //   this.showProgressBar();
  //   const date = new Date();
  //   const year = date.getFullYear();
  //   const month = date.getMonth() + 1;
  //   const day = date.getDate();
  //   const stringDate = year + '-' + month + '-' + day;
  //   let idTra: string;
  //   if (this.traRadioControl.value === false) {
  //     idTra = 'n';
  //   } else {
  //     idTra = 'n/n';
  //   }
  //   const saleM: CashSaleI[] = [];
  //   this.stockDatasourceArray.forEach(value => {
  //     saleM.push({
  //       amount: value.amount,
  //       discount: value.discount,
  //       quantity: value.quantity,
  //       product: value.product,
  //       category: value.stock.category,
  //       unit: value.stock.unit,
  //       channel: 'retail',
  //       date: stringDate,
  //       id: '',
  //       idTra: idTra,
  //       user: this.currentUser.id,
  //       stockId: value.stock.id// for reference only
  //     });
  //   });
  //   this.saleDatabase.addCashSale(saleM)
  //     .then(value => {
  //       console.log(value);
  //       this.hideProgressBar();
  //       this.stockDatasourceArray = [];
  //       this.stockDatasource = new MatTableDataSource(this.stockDatasourceArray);
  //       this.updateTotalBill();
  //       this.snack.open('Done save the cart', 'Ok', {duration: 3000});
  //     })
  //     .catch(reason => {
  //       console.log(reason);
  //       this.snack.open(reason, 'Ok');
  //     });
  // }

  private clearInputs() {
    this.productNameControlInput.setValue('');
    this.categoryControlInput.setValue('');
    this.supplierControlInput.setValue('');
    this.unitsControlInput.setValue('');
    this.quantityControlInput.setValue(null);
    this.wholesaleQuantityControlInput.setValue(null);
    this.purchasePriceControlInput.setValue(null);
    this.retailPriceControlInput.setValue(null);
    this.retailWholesalePriceControlInput.setValue(null);
    this.wholesalePriceControlInput.setValue(null);
    this.nhifPriceControlInput.setValue(null);
    this.reorderControlInput.setValue(null);
    this.shelfControlInput.setValue('');
    this.expireDateControlInput.setValue(null);
    this.showRetailProfit = 0;
    this.wholesaleProfit = 0;
    // this.quantityControlInput.setValue(0);
    // this.discountControlInput.setValue(0);
    // this.retailWholesaleRadioInput.setValue(false);
    // this.nhifRadioInput.setValue(false);
    // this.receiveControlInput.setValue(0);
    //
    // this.totalPrice = 0;
    // this.priceUnit = 0;
  }

  private showProgressBar() {
    this.showProgress = true;
  }

  private hideProgressBar() {
    this.showProgress = false;
  }

  private initializeView() {
    // initial value
    this.stock = null;
    this.retailWholesaleRadioInput.setValue(false);
    this.nhifRadioInput.setValue(false);
    this.traRadioControl.setValue(false);
    this.discountControlInput.setValue(0);
    this.receiveControlInput.setValue(0);
    this.stockDatasourceArray = [];
    this.saleDatasourceArray = [];
    this.categoryControlInput.valueChanges.subscribe(value => {
      this.getCategory(value);
    }, error1 => {
      console.log(error1);
    });
    this.supplierControlInput.valueChanges.subscribe(value => {
      this.getSuppliers(value);
    }, error1 => {
      console.log(error1);
    });
    this.unitsControlInput.valueChanges.subscribe(value => {
      this.getUnits(value);
    }, error1 => {
      console.log(error1);
    });
    this.searchSaleControl.valueChanges.subscribe(value => {
      this.salesDatasource.filter = value.toString().toLowerCase();
    }, error1 => {
      console.log(error1);
    });
    this.searchStockControl.valueChanges.subscribe(value => {
      this.stockDatabase.getAllStock(stocks1 => {
        this.stockDatasourceArray = stocks1;
        this.stockDatasource = new MatTableDataSource(stocks1);
        this.stockDatasource.paginator = this.paginator;
        this.stockDatasource.filter = value;
      });
    }, error1 => console.log(error1));

    // live database
    this.saleDatabase.getAllCashSaleOfUser(this.currentUser.id, datasource => {
      this.saleDatasourceArray = [];
      this.saleDatasourceArray = datasource;
      this.salesDatasource = new MatTableDataSource(this.saleDatasourceArray);
    });
    this.getStocksFromCache();
  }

  getStocksFromCache() {
    this.stockDatabase.getAllStock(stocks1 => {
      this.stockDatasourceArray = stocks1;
      this.stockDatasource = new MatTableDataSource(stocks1);
      this.stockDatasource.paginator = this.paginator;
    });
  }

  // private showChanges() {
  //   this.changePrice = this.receiveControlInput.value - this.totalPrice;
  // }
  //
  // private showTotalPrice(): { quantity: number, amount: number } {
  //   if (this.retailWholesaleRadioInput.value === false) {
  //     this.priceUnit = this.stock.retailPrice;
  //     this.totalPrice = (this.quantityControlInput.value * this.stock.retailPrice) - (<number>this.discountControlInput.value);
  //     return {amount: this.totalPrice, quantity: this.quantityControlInput.value};
  //   } else {
  //     this.priceUnit = this.stock.wholesalePrice;
  //     const a: number = (Number(this.quantityControlInput.value) * Number(this.stock.wholesaleQuantity));
  //     const totalPrice1 = (a * (<number>this.stock.wholesalePrice / Number(this.stock.wholesaleQuantity)));
  //     this.totalPrice = totalPrice1 - <number>this.discountControlInput.value;
  //     return {amount: this.totalPrice, quantity: a};
  //   }
  // }
  //
  // private updateTotalBill() {
  //   this.totalPurchase = 0;
  //   this.stockDatasourceArray.forEach(value => {
  //     this.totalPurchase += value.amount;
  //   });
  // }
  //
  // private updateTotalSales() {
  //   let s = 0;
  //   this.saleDatasourceArray.forEach(value => {
  //     s += value.amount;
  //   });
  //   this.totalSaleAmount = s;
  // }

  private getSuppliers(supplier: string) {
    this.indexDb.getItem<SupplierI[]>('suppliers').then(value => {
      const supplierF: SupplierI[] = value.filter(value1 => (value1.name.toLowerCase().includes(supplier.toLowerCase())));
      this.suppliers = of(supplierF);
    }).catch(reason => {
      console.log(reason);
      this.snack.open(reason, 'Ok');
    });
  }

  private getUnits(unit: string) {
    this.indexDb.getItem<UnitsI[]>('units').then(value => {
      const unitsF: UnitsI[] = value.filter(value1 => (value1.name.toLowerCase().includes(unit.toLowerCase())));
      this.units = of(unitsF);
    }).catch(reason => {
      console.log(reason);
      this.snack.open(reason, 'Ok');
    });
  }

  private getCategory(category: string) {
    this.indexDb.getItem<CategoryI[]>('categories').then(value => {
      const cateF: CategoryI[] = value.filter(value1 => (value1.name.toLowerCase().includes(category.toLowerCase())));
      this.categories = of(cateF);
    }).catch(reason => {
      console.log(reason);
      this.snack.open(reason, 'Ok');
    });
  }

  editStock(element: Stock) {
    this.productNameControlInput.setValue(element.product);
    this.categoryControlInput.setValue(element.category);
    this.supplierControlInput.setValue(element.supplier);
    this.unitsControlInput.setValue(element.unit);
    this.quantityControlInput.setValue(element.quantity);
    this.wholesaleQuantityControlInput.setValue(element.wholesaleQuantity);
    this.purchasePriceControlInput.setValue(element.purchase);
    this.retailPriceControlInput.setValue(element.retailPrice);
    this.retailWholesalePriceControlInput.setValue(element.retailWholesalePrice);
    this.wholesalePriceControlInput.setValue(element.wholesalePrice);
    this.nhifPriceControlInput.setValue(element.nhifPrice);
    this.reorderControlInput.setValue(element.reorder);
    this.shelfControlInput.setValue(element.shelf);
    this.expireDateControlInput.setValue(element.expire);

    this.snack.open('Now edit the document and save it', 'Ok', {duration: 3000});
    this.stock = element;
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
            this.getStocksFromCache();
          }
        });
      }
    });
  }

  private getSqlDate(date: Date): string {
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString(2);
    let day = (date.getDate()).toString(2);
    if (month.length === 1) {
      month = '0'.concat(month);
    }
    if (day.length === 1) {
      day = '0'.concat(day);
    }
    return year + '-' + month + '-' + day;
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

