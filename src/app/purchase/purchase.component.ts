import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {UserDatabaseService} from '../services/user-database.service';
import {NgForage} from 'ngforage';
import {MatDialog, MatPaginator, MatSidenav, MatSnackBar, MatTableDataSource} from '@angular/material';
import {StockDatabaseService} from '../services/stock-database.service';
import {SalesDatabaseService} from '../services/sales-database.service';
import {UserI} from '../model/UserI';
import {FormControl} from '@angular/forms';
import {Stock} from '../model/stock';
import {Observable, of} from 'rxjs';
import {SupplierI} from '../model/SupplierI';
import {UnitsI} from '../model/UnitsI';
import {CashSaleI} from '../model/CashSale';
import {DialogDeleteComponent, StockComponent} from '../stock/stock.component';
import {ReceiptI} from '../model/ReceiptI';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

  constructor(private router: Router,
              private userDatabase: UserDatabaseService,
              private indexDb: NgForage,
              private snack: MatSnackBar,
              private dialog: MatDialog,
              private stockDatabase: StockDatabaseService,
              private saleDatabase: SalesDatabaseService) {
  }

  private currentUser: UserI;
  isAdmin = false;
  isLogin = false;
  showProgress = false;
  totalPurchase = 0;
  showRetailProfit = 0;
  wholesaleProfit = 0;
  productNameControlInput = new FormControl();
  receiveControlInput = new FormControl();
  quantityControlInput = new FormControl();
  discountControlInput = new FormControl();
  searchSaleControl = new FormControl();
  retailWholesaleRadioInput = new FormControl();
  traRadioControl = new FormControl();
  nhifRadioInput = new FormControl();
  private stock: Stock;
  private stockDatasourceArray: Stock[];
  purchaseProducts: Observable<Stock[]>;
  receipts: Observable<ReceiptI[]>;
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
  receipNumberControlInput = new FormControl();
  supplierControlInput = new FormControl();
  unitsControlInput = new FormControl();
  shelfControlInput = new FormControl();
  expireDateControlInput = new FormControl();
  invoiceNumberControlInput = new FormControl();
  purchaseDateControlInput = new FormControl();
  dueDateControlInput = new FormControl();
  creditPurchaseButton = new FormControl();

  private static getSqlDate(date: any): string {
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
    } else if (this.receipNumberControlInput.value === null) {
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
        category: this.receipNumberControlInput.value,
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
        expire: StockComponent.getSqlDate(<Date>this.expireDateControlInput.value),
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
        }
      });
    }
  }

  private clearInputs() {
    this.productNameControlInput.setValue('');
    this.receipNumberControlInput.setValue('');
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
    this.productNameControlInput.valueChanges.subscribe(value => {
      this.getProduct(value);
    }, error1 => console.log(error1));
    this.receipNumberControlInput.valueChanges.subscribe(value => {
      this.getReceipts(value);
    }, error1 => {
      console.log(error1);
    });
    this.invoiceNumberControlInput.valueChanges.subscribe(value => {
      this.getInvoice(value);
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
    // this.searchSaleControl.valueChanges.subscribe(value => {
    //   this.salesDatasource.filter = value.toString().toLowerCase();
    // }, error1 => {
    //   console.log(error1);
    // });
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
  }

  // private getStocksFromCache() {
  //   this.stockDatabase.getAllStock(stocks1 => {
  //     this.stockDatasourceArray = stocks1;
  //     this.stockDatasource = new MatTableDataSource(stocks1);
  //     this.stockDatasource.paginator = this.paginator;
  //     let sTotal = 0;
  //     stocks1.forEach(value => {
  //       sTotal += <number>value.purchase;
  //     });
  //     this.totalPurchase = sTotal;
  //   });
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

  private getProduct(product: string) {
    this.indexDb.getItem<Stock[]>('stocks').then(value => {
      const stockF: Stock[] = value.filter(value1 => (value1.product.toLowerCase().includes(product.toLowerCase())));
      this.purchaseProducts = of(stockF);
    }).catch(reason => {
      console.log(reason);
      this.snack.open(reason, 'Ok');
    });
  }

  private getReceipts(category: string) {
    this.indexDb.getItem<ReceiptI[]>('purchaseRefs').then(value => {
      let cateF: ReceiptI[] = value.filter(value1 => (value1.reference.toLowerCase().includes(category.toLowerCase())));
      cateF = cateF.filter(value1 => value1.type === 'receipt');
      this.receipts = of(cateF);
    }).catch(reason => {
      console.log(reason);
      this.snack.open(reason, 'Ok');
    });
  }

  private getInvoice(invoice: string) {
    this.indexDb.getItem<ReceiptI[]>('purchaseRefs').then(value => {
      let cateF: ReceiptI[] = value.filter(value1 => (value1.reference.toLowerCase().includes(invoice.toLowerCase())));
      cateF = cateF.filter(value1 => value1.type === 'invoice');
      this.receipts = of(cateF);
    }).catch(reason => {
      console.log(reason);
      this.snack.open(reason, 'Ok');
    });
  }

  editStock(element: Stock) {
    this.productNameControlInput.setValue(element.product);
    this.receipNumberControlInput.setValue(element.category);
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
          }
        });
      }
    });
  }

  updateSelectedStock(purchaseP: Stock) {

  }
}
