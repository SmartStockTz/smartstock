import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSidenav, MatSnackBar, MatTableDataSource} from '@angular/material';
import {UserI} from '../model/UserI';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {Stock} from '../model/stock';
import {CartI} from '../model/cart';
import {CashSaleI} from '../model/CashSale';
import {Router} from '@angular/router';
import {UserDatabaseService} from '../services/user-database.service';
import {NgForage} from 'ngforage';
import {SalesDatabaseService} from '../services/sales-database.service';
import {OrderI} from '../model/OderI';
import {DialogDeleteComponent} from '../stock/stock.component';
import {PrintServiceService} from '../services/print-service.service';

export interface DialogData {
  customer?: string;
  name?: string;
}

@Component({
  selector: 'app-whole-sale',
  templateUrl: './whole-sale.component.html',
  styleUrls: ['./whole-sale.component.css']
})
export class WholeSaleComponent implements OnInit {
  private currentUser: UserI;
  isAdmin = false;
  isLogin = false;
  showProgress = false;
  totalPrice = 0;
  priceUnit = 0;
  changePrice = 0;
  totalBill = 0;
  totalOrder = 0;
  totalSaleAmount = 0;
  productNameControlInput = new FormControl();
  receiveControlInput = new FormControl();
  quantityControlInput = new FormControl();
  discountControlInput = new FormControl();
  searchSaleControl = new FormControl();
  retailWholesaleRadioInput = new FormControl();
  traRadioControl = new FormControl();
  nhifRadioInput = new FormControl();
  filteredOptions: Observable<Stock[]>;
  stocks: Stock[];
  stock: Stock = {
    category: '',
    objectId: '',
    nhifPrice: 0,
    product: '',
    profit: 0,
    purchase: 0,
    quantity: 0,
    reorder: 0,
    retailPrice: 0,
    retailWholesalePrice: 0,
    shelf: '',
    supplier: '',
    q_status: '',
    times: 0,
    expire: '',
    retail_stockcol: '',
    unit: '',
    wholesalePrice: 0,
    wholesaleQuantity: 0,
  };
  cartDatasourceArray: CartI[];
  cartDatasource: MatTableDataSource<CartI>;
  saleDatasourceArray: CashSaleI[];
  salesDatasource: MatTableDataSource<CashSaleI>;
  cartColums = ['product', 'quantity', 'amount', 'discount', 'action'];
  saleColums = ['Date', 'product', 'quantity', 'amount', 'discount'];
  @ViewChild('sidenav') sidenav: MatSidenav;
  searchOrderControl = new FormControl();
  salesOrderDatasourceArray: OrderI[];
  salesOrderDatasource: MatTableDataSource<OrderI>;
  orderColums = ['date', 'amount', 'customer', 'action'];

  constructor(private router: Router,
              private userDatabase: UserDatabaseService,
              private indexDb: NgForage,
              private snack: MatSnackBar,
              private dialog: MatDialog,
              private printS: PrintServiceService,
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

  private getProduct(product: string) {
    this.indexDb.getItem<Stock[]>('stocks').then(value => {
      const stocksFiltered: Stock[] = value.filter(value1 => (value1.product.toLowerCase().includes(product.toLowerCase())));
      this.filteredOptions = of(stocksFiltered);
    }).catch(reason => {
      console.log(reason);
      this.snack.open(reason, 'Ok');
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
    this.indexDb.getItem<UserI>('user').then(user => {
      this.userDatabase.logout(user, value => {
        if (value === null) {
          this.snack.open('Can\'t log you out', 'Ok', {duration: 3000});
        } else {
          this.router.navigateByUrl('').catch(reason => console.log(reason));
        }
      });
    }).catch(reason => {
      console.log(reason);
      this.snack.open('Can\'t log you out', 'Ok', {duration: 3000});
    });
  }

  addToCart() {
    if (this.productNameControlInput.value === null) {
      this.snack.open('Please enter the product to sell', 'Ok', {duration: 3000});
    } else if (this.quantityControlInput.value === null) {
      this.snack.open('Please enter quantity of a product you sell', 'Ok', {duration: 3000});
    } else if (this.totalPrice === 0) {
      this.snack.open('Can\'t sell zero product', 'Ok');
    } else {
      const showTotalPrice = this.showTotalPrice();
      this.cartDatasourceArray.push({
        product: this.stock.product,
        quantity: showTotalPrice.quantity,
        amount: showTotalPrice.amount,
        discount: this.discountControlInput.value,
        stock: this.stock,
      });
      this.cartDatasource = new MatTableDataSource(this.cartDatasourceArray);
      this.updateTotalBill();
      this.clearInputs();
    }
  }

  removeItemFromCart(element: CartI) {
    this.cartDatasourceArray = this.cartDatasourceArray.filter(value => value !== element);
    this.cartDatasource = new MatTableDataSource(this.cartDatasourceArray);
    this.updateTotalBill();
  }

  updateSelectedStock(st: Stock) {
    this.stock = st;
    this.showTotalPrice();
  }

  submitBill() {
    this.showProgressBar();
    // const date = new Date();
    // const year = date.getFullYear();
    // const month = date.getMonth() + 1;
    // const day = date.getDate();
    // const stringDate = year + '-' + month + '-' + day;
    const stringDate = SalesDatabaseService.getCurrentDate();
    let idTra: string;
    if (this.traRadioControl.value === false) {
      idTra = 'n';
    } else {
      idTra = 'n/n';
    }
    const saleM: CashSaleI[] = [];
    this.cartDatasourceArray.forEach(value => {
      saleM.push({
        amount: value.amount,
        discount: value.discount,
        quantity: value.quantity,
        product: value.product,
        category: value.stock.category,
        unit: value.stock.unit,
        channel: 'whole',
        date: stringDate,
        idOld: '',
        idTra: idTra,
        user: this.currentUser.objectId,
        stockId: value.stock.objectId
      });
    });
    this.saleDatabase.addWholeCashSale(saleM, value => {
      if (value == null) {
        this.snack.open('Sales can\'t be completed, please try again', 'Ok');
        this.hideProgressBar();
      } else if (value === 'BE') {
        this.snack.open('You cant sell more than 50 items at once reduce product from cart then submit',
          'Ok', {duration: 4000});
        this.hideProgressBar();
      } else {
        this.snack.open('Sales saved', 'Ok', {duration: 3000});
        this.hideProgressBar();
        this.clearCart();
      }
    });
  }

  saveOrder() {
    this.openDialog();
  }

  private clearInputs() {
    this.productNameControlInput.setValue('');
    this.quantityControlInput.setValue(null);
    this.discountControlInput.setValue(0);
    this.retailWholesaleRadioInput.setValue(false);
    this.nhifRadioInput.setValue(false);
    this.receiveControlInput.setValue(0);
    this.changePrice = 0;
    this.totalPrice = 0;
    this.priceUnit = 0;
    this.stock.shelf = '';
  }

  private clearCart() {
    this.cartDatasourceArray = [];
    this.cartDatasource = new MatTableDataSource(this.cartDatasourceArray);
    this.updateTotalBill();
    this.snack.open('Done saving items', 'Ok', {duration: 3000});
  }

  private showProgressBar() {
    this.showProgress = true;
  }

  private hideProgressBar() {
    this.showProgress = false;
  }

  private initializeView() {
    this.retailWholesaleRadioInput.setValue(true);
    this.nhifRadioInput.setValue(false);
    this.traRadioControl.setValue(false);
    this.discountControlInput.setValue(0);
    this.receiveControlInput.setValue(0);
    this.cartDatasourceArray = [];
    this.saleDatasourceArray = [];
    this.productNameControlInput.valueChanges.subscribe(value => {
      this.getProduct(value);
    }, error1 => {
      console.log(error1);
    });
    this.quantityControlInput.valueChanges.subscribe(value => {
      if (value === null) {
        this.snack.open('Quantity must be number', 'Ok', {duration: 3000});
        this.showTotalPrice();
      } else {
        this.showTotalPrice();
      }
    }, error1 => {
      console.log(error1);
    });
    this.discountControlInput.valueChanges.subscribe(value => {
      if (value === null) {
        this.snack.open('Discount must be a number', 'Ok', {duration: 3000});
        this.showTotalPrice();
      } else {
        this.showTotalPrice();
      }
    }, error1 => {
      console.log(error1);
    });
    this.searchSaleControl.valueChanges.subscribe(value => {
      this.salesDatasource.filter = value.toString().toLowerCase();
    }, error1 => {
      console.log(error1);
    });
    this.receiveControlInput.valueChanges.subscribe(value => {
      if (value === null) {
        this.snack.open('Please enter number ', 'Ok', {duration: 3000});
      } else {
        this.showChanges();
      }
    }, error1 => {
      console.log(error1);
    });
    this.searchOrderControl.valueChanges.subscribe(value => {
      this.salesOrderDatasource.filter = value.toString().toLowerCase();
    }, error1 => console.log(error1));

    // live database
    this.saleDatabase.getAllWholeCashSaleOfUser(this.currentUser.objectId, datasource => {
      this.saleDatasourceArray = [];
      this.saleDatasourceArray = datasource;
      this.salesDatasource = new MatTableDataSource(this.saleDatasourceArray);
      this.updateTotalSales();
    });
    this.saleDatabase.getAllOrders(orders => {
      this.salesOrderDatasourceArray = orders;
      this.salesOrderDatasource = new MatTableDataSource<OrderI>(this.salesOrderDatasourceArray);
      let orderT = 0;
      this.salesOrderDatasourceArray.forEach(value => {
        orderT += value.amount;
      });
      this.totalOrder = orderT;
    });
  }

  private showChanges() {
    this.changePrice = this.receiveControlInput.value - this.totalPrice;
  }

  // to be changed
  private showTotalPrice(): { quantity: number, amount: number } {
    this.priceUnit = this.stock.wholesalePrice;
    const a: number = (Number(this.quantityControlInput.value) * Number(this.stock.wholesaleQuantity));
    const totalPrice1 = (a * (<number>this.stock.wholesalePrice / Number(this.stock.wholesaleQuantity)));
    this.totalPrice = totalPrice1 - <number>this.discountControlInput.value;
    return {amount: this.totalPrice, quantity: a};
  }

  private updateTotalBill() {
    this.totalBill = 0;
    this.cartDatasourceArray.forEach(value => {
      this.totalBill += value.amount;
    });
  }

  private updateTotalSales() {
    let s = 0;
    this.saleDatasourceArray.forEach(value => {
      s += value.amount;
    });
    this.totalSaleAmount = s;
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === null) {
        this.snack.open('Customer not entered', 'Ok', {duration: 3000});
      } else if (result === undefined) {
        this.snack.open('Customer not entered', 'Ok', {duration: 3000});
      } else if (result === '') {
        this.snack.open('Customer not entered', 'Ok', {duration: 3000});
      } else {
        this.showProgressBar();
        this.saleDatabase.addOrder({
          date: SalesDatabaseService.getCurrentDate(),
          customer: result,
          amount: this.totalBill,
          cart: this.cartDatasourceArray,
          complete: false,
          idOld: ''
        }, value => {
          if (value == null) {
            this.snack.open('Order not saved, try again', 'Ok', {duration: 3000});
            this.hideProgressBar();
          } else {
            this.clearCart();
            this.hideProgressBar();
          }
        });
      }
    });
  }

  printOrder(element: OrderI) {
    this.printS.printOrder(element, value => {
      if (value === null) {
        this.snack.open('Printing fail', 'Ok', {duration: 3000});
      } else {
        this.snack.open('Done printing', 'Ok', {duration: 3000});
      }
    });
  }

  deleteOrder(element: OrderI) {
    const matDialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350',
      data: element,
    });

    matDialogRef.afterClosed().subscribe(value => {
      if (value === 'no') {
        this.snack.open('Delete canceled', 'Ok', {duration: 3000});
      } else {
        this.showProgressBar();
        this.saleDatabase.deleteOrder(value, value1 => {
          if (value1 === null) {
            this.snack.open('Order delete fail', 'Ok', {duration: 3000});
            this.hideProgressBar();
          } else {
            this.snack.open('Order delete is successful', 'Ok', {duration: 3000});
            this.hideProgressBar();
          }
        });
      }
    });
  }

  printCart() {
    this.printS.printCart(this.cartDatasourceArray, value => {
      if (value === null) {
        this.snack.open('Cart not printed', 'Ok', {duration: 3000});
      } else {
        this.snack.open('Cart printed', 'Ok', {duration: 30000});
      }
    });
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'app-dialog.html',
})
export class DialogComponent {
  customerControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  done() {
    if (this.customerControl.value !== null) {
      this.dialogRef.close(this.customerControl.value);
    }
  }
}
