import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {UserDatabaseService} from '../../services/user-database.service';
import {NgForage} from 'ngforage';
import {MatDialog, MatPaginator, MatSidenav, MatSnackBar, MatTableDataSource} from '@angular/material';
import {StockDatabaseService} from '../../services/stock-database.service';
import {UserI} from '../../model/UserI';
import {FormControl} from '@angular/forms';
import {Stock} from '../../model/stock';
import {Observable, of} from 'rxjs';
import {SupplierI} from '../../model/SupplierI';
import {UnitsI} from '../../model/UnitsI';
import {ReceiptI} from '../../model/ReceiptI';
import {PurchaseI} from '../../model/PurchaseI';
import {PurchaseDatabaseService} from '../../services/purchase-database.service';
import {SsmToolsService} from '../../services/ssm-tools.service';
import {randomString} from '../../database/ParseBackend';
import {DeviceInfo} from '../../common-components/DeviceInfo';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent extends DeviceInfo implements OnInit {

  constructor(private router: Router,
              private userDatabase: UserDatabaseService,
              private indexDb: NgForage,
              private snack: MatSnackBar,
              private dialog: MatDialog,
              private stockDatabase: StockDatabaseService,
              private purchaseDatabase: PurchaseDatabaseService) {
    super();
  }

  private currentUser: UserI;
  private stock: Stock;
  private stockDatasourceArray: Stock[];
  purchaseDatasourceArray: PurchaseI[];
  isAdmin = false;
  isLogin = false;
  showProgress = false;
  showCreditPurchase = false;
  totalPurchase = 0;
  productNameControlInput = new FormControl();
  quantityControlInput = new FormControl();
  purchaseProducts: Observable<Stock[]>;
  receipts: Observable<ReceiptI[]>;
  suppliers: Observable<SupplierI[]>;
  units: Observable<UnitsI[]>;
  selecteStock: Stock;
  purchaseDatasource: MatTableDataSource<PurchaseI>;
  purchaseColums = ['product', 'date', 'due', 'reference', 'quantity', 'amount', 'action'];
  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  searchPurchaseControl = new FormControl();
  purchasePriceControlInput = new FormControl();
  receipNumberControlInput = new FormControl();
  supplierControlInput = new FormControl();
  unitsControlInput = new FormControl();
  expireDateControlInput = new FormControl();
  invoiceNumberControlInput = new FormControl();
  purchaseDateControlInput = new FormControl();
  dueDateControlInput = new FormControl();
  creditPurchaseButton = new FormControl();
  showRetailProfit = 0;
  wholesaleProfit = 0;
  allPurchaseDatasourceArray: PurchaseI[];
  allPurchaseDatasource: MatTableDataSource<PurchaseI>;

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
    // this.userDatabase.currentUser(value => {
    //   if (value === null) {
    //     this.isLogin = false;
    //     this.router.navigateByUrl('login').catch(reason => console.log(reason));
    //   } else {
    //     this.isAdmin = value.role === 'admin';
    //     this.isLogin = true;
    //     this.currentUser = value;
        // control input initialize
       // this.initializeView();
    //   }
    // });
  }

  addPurchaseToCart() {
    if (this.productNameControlInput.value === null || this.productNameControlInput.value === '') {
      this.snack.open('Please enter a product name', 'Ok', {duration: 3000});
    } else if (this.purchaseDateControlInput.value === null || this.purchaseDateControlInput.value === '') {
      this.snack.open('Please enter purchase date', 'Ok', {duration: 3000});
    } else if (this.dueDateControlInput.value === null || this.dueDateControlInput.value === '') {
      this.snack.open('Please enter due date', 'Ok', {duration: 3000});
    } else if ((this.invoiceNumberControlInput.value === null || this.invoiceNumberControlInput.value === '')
      && (this.receipNumberControlInput.value === null || this.receipNumberControlInput.value === '')) {
      this.snack.open('Please enter reference number', 'Ok', {duration: 3000});
    } else if (this.creditPurchaseButton.value &&
      (this.invoiceNumberControlInput.value === null || this.invoiceNumberControlInput.value === '')) {
      this.snack.open('Please enter invoice number', 'Ok', {duration: 3000});
    } else if (this.supplierControlInput.value === null || this.supplierControlInput.value === '') {
      this.snack.open('Please enter supplier', 'Ok', {duration: 3000});
    } else if (<number>this.quantityControlInput.value === null || <number>this.quantityControlInput.value < 0) {
      this.snack.open('Please enter quantity and must be positive', 'Ok', {duration: 3000});
    } else if (<number>this.purchasePriceControlInput.value === null || <number>this.purchasePriceControlInput.value < 0) {
      this.snack.open('Please enter purchase price and must be positive', 'Ok', {duration: 3000});
    } else if (this.expireDateControlInput.value === null || this.expireDateControlInput.value === '') {
      this.snack.open('Please enter expire date of the product', 'Ok', {duration: 3000});
    } else if (this.selecteStock === null || this.selecteStock === undefined) {
      this.snack.open('Make sure you choose a product name from dropdown', 'Ok', {duration: 3000});
    } else {
      let ch: string;
      let ref: string;
      let pd: boolean;
      if (this.creditPurchaseButton.value) {
        ch = 'credit';
        ref = this.invoiceNumberControlInput.value;
        pd = false;
      } else {
        ch = 'cash';
        ref = this.receipNumberControlInput.value;
        pd = true;
      }
      this.purchaseDatasourceArray.push({
        product: this.productNameControlInput.value,
        idOld: randomString(8),
        quantity: this.quantityControlInput.value,
        channel: ch,
        date: SsmToolsService.getDateInString(this.purchaseDateControlInput.value),
        due: SsmToolsService.getDateInString(this.dueDateControlInput.value),
        purchase: this.purchasePriceControlInput.value,
        reference: ref,
        paid: pd,
        stockId: this.selecteStock.objectId,
        expire: SsmToolsService.getDateInString(this.expireDateControlInput.value),
        amount: <number>this.quantityControlInput.value * <number>this.purchasePriceControlInput.value
      });
      this.purchaseDatasource = new MatTableDataSource<PurchaseI>(this.purchaseDatasourceArray);
      //  this.purchaseDatabase.addAllPurchase()
      this.updateTotalPrice();
      this.clearInputs();
    }
  }

  submitPurchase() {
    if (this.purchaseDatasourceArray.length === 0) {
      this.snack.open('Please add something in cart to submit', 'Ok', {duration: 3000});
    } else {
      this.showProgressBar();
      this.purchaseDatabase.addAllPurchase(this.purchaseDatasourceArray, value => {
        if (value === null) {
          this.snack.open('Failed to save purchase, try again or check if you have internet connection',
            'Ok', {duration: 3000});
          this.hideProgressBar();
        } else if (value === 'BE') {
          this.snack.open('You cant send more than 50 items at once, reduce your cart', 'Ok', {duration: 3000});
          this.hideProgressBar();
        } else {
          this.snack.open('Purchase saved successfully', 'Ok', {duration: 3000});
          this.purchaseDatasourceArray = [];
          this.purchaseDatasource = new MatTableDataSource<PurchaseI>(this.purchaseDatasourceArray);
          this.hideProgressBar();
        }
      });
    }
  }

  updateTotalPrice() {
    this.totalPurchase = 0;
    this.purchaseDatasourceArray.forEach(value => {
      this.totalPurchase += <number>value.amount;
    });
  }

  private clearInputs() {
    this.productNameControlInput.setValue(null);
    // this.receipNumberControlInput.setValue(null);
    // this.invoiceNumberControlInput.setValue(null);
    // this.supplierControlInput.setValue(null);
    this.creditPurchaseButton.setValue(false);
    this.quantityControlInput.setValue(null);
    this.purchasePriceControlInput.setValue(null);
    this.expireDateControlInput.setValue(null);
    this.showCreditPurchase = this.creditPurchaseButton.value;
    this.selecteStock = null;
  }

  private showProgressBar() {
    this.showProgress = true;
  }

  private hideProgressBar() {
    this.showProgress = false;
  }

  // private initializeView() {
  //   // initial value
  //   this.stock = null;
  //   this.purchaseDatasourceArray = [];
  //   this.allPurchaseDatasource = new MatTableDataSource([]);
  //   this.allPurchaseDatasource.paginator = this.paginator;
  //   this.creditPurchaseButton.setValue(false);
  //   this.creditPurchaseButton.valueChanges.subscribe(value => {
  //     this.showCreditPurchase = <boolean>value;
  //   });
  //   this.productNameControlInput.valueChanges.subscribe(value => {
  //     if (value != null) {
  //       this.getProduct(value);
  //     }
  //   }, error1 => console.log(error1));
  //   this.receipNumberControlInput.valueChanges.subscribe(value => {
  //     this.getReceipts(value);
  //   }, error1 => {
  //     console.log(error1);
  //   });
  //   this.invoiceNumberControlInput.valueChanges.subscribe(value => {
  //     this.getInvoice(value);
  //   }, error1 => {
  //     console.log(error1);
  //   });
  //   this.supplierControlInput.valueChanges.subscribe(value => {
  //     this.getSuppliers(value);
  //   }, error1 => {
  //     console.log(error1);
  //   });
  //   this.unitsControlInput.valueChanges.subscribe(value => {
  //     this.getUnits(value);
  //   }, error1 => {
  //     console.log(error1);
  //   });
  //   this.searchPurchaseControl.valueChanges.subscribe(value => {
  //     this.getPurchasesFromCache().then(value1 => {
  //       this.allPurchaseDatasource.filter = value.toString().toLowerCase();
  //     }).catch(reason => console.log(reason));
  //   });
  //   // get all purchases new socket established
  //   this.purchaseDatabase.getAllPurchase(null);
  //   this.getPurchasesFromCache().catch(reason => console.log(reason));
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

  private async getPurchasesFromCache() {
    await this.indexDb.getItem<PurchaseI[]>('purchases').then(value => {
      this.allPurchaseDatasourceArray = [];
      this.allPurchaseDatasourceArray = value;
      this.allPurchaseDatasource = new MatTableDataSource<PurchaseI>(this.allPurchaseDatasourceArray);
      this.allPurchaseDatasource.paginator = this.paginator;
    });
  }

  private editStock(element: Stock) {
    this.productNameControlInput.setValue(element.product);
    this.receipNumberControlInput.setValue(element.category);
    this.supplierControlInput.setValue(element.supplier);
    this.unitsControlInput.setValue(element.unit);
    this.quantityControlInput.setValue(element.quantity);
    // this.wholesaleQuantityControlInput.setValue(element.wholesaleQuantity);
    // this.purchasePriceControlInput.setValue(element.purchase);
    // this.retailPriceControlInput.setValue(element.retailPrice);
    // this.retailWholesalePriceControlInput.setValue(element.retailWholesalePrice);
    // this.wholesalePriceControlInput.setValue(element.wholesalePrice);
    // this.nhifPriceControlInput.setValue(element.nhifPrice);
    // this.reorderControlInput.setValue(element.reorder);
    // this.shelfControlInput.setValue(element.shelf);
    this.expireDateControlInput.setValue(element.expire);

    this.snack.open('Now edit the document and save it', 'Ok', {duration: 3000});
    this.stock = element;
  }

  removePurchaseFromCart(element: PurchaseI) {
    this.purchaseDatasourceArray = this.purchaseDatasourceArray.filter(value => value.idOld !== element.idOld);
    this.purchaseDatasource = new MatTableDataSource(this.purchaseDatasourceArray);
    this.updateTotalPrice();
    // const matDialogRef = this.dialog.open(DialogDeleteComponent, {width: '350', data: element});
    // matDialogRef.afterClosed().subscribe(value => {
    //   if (value === 'no') {
    //     this.snack.open('Deletion is cancelled', 'Ok', {duration: 3000});
    //   } else {
    //     this.showProgressBar();
    //     this.stockDatabase.deleteStock(element, value1 => {
    //       if (value1 === null) {
    //         this.snack.open('Product is not deleted successful, try again', 'Ok', {duration: 3000});
    //         this.hideProgressBar();
    //       } else {
    //         this.snack.open('Product successful deleted', 'Ok', {duration: 3000});
    //         this.hideProgressBar();
    //         // update tables
    //       }
    //     });
    //   }
    // });
  }

  updateSelectedPurchase(stock: Stock) {
    this.selecteStock = stock;
  }

  handleSearch(query: string) {
    console.log(query);
  }
}
