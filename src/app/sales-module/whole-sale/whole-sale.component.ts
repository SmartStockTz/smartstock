import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSidenav, MatSnackBar, MatTableDataSource} from '@angular/material';
import {UserI} from '../../model/UserI';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {Stock} from '../../model/stock';
import {CartI} from '../../model/cart';
import {CashSaleI} from '../../model/CashSale';
import {Router} from '@angular/router';
import {UserDatabaseService} from '../../services/user-database.service';
import {NgForage} from 'ngforage';
import {SalesDatabaseService} from '../../services/sales-database.service';
import {OrderI} from '../../model/OderI';
import {DialogDeleteComponent} from '../../stock-module/stock/stock.component';
import {PrintServiceService} from '../../services/print-service.service';

export interface DialogData {
  customer?: string;
  name?: string;
  type: number;
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
  activeTab = 0;
  @ViewChild('cartPaginator') paginator: MatPaginator;
  @ViewChild('salePaginator') salePaginator: MatPaginator;
  @ViewChild('ordersPaginator') ordersPaginator: MatPaginator;
  customerControl = new FormControl();

  constructor(private router: Router,
              private userDatabase: UserDatabaseService,
              private indexDb: NgForage,
              private snack: MatSnackBar,
              private dialog: MatDialog,
              private printS: PrintServiceService,
              private saleDatabase: SalesDatabaseService) {
  }

  ngOnInit() {
    this.userDatabase.currentUser(value => {
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

  addToCart() {
    if (this.productNameControlInput.value === null) {
      this.snack.open('Please enter the product to sell', 'Ok', {duration: 3000});
    } else if (this.quantityControlInput.value === null) {
      this.snack.open('Please enter quantity of a product you sell', 'Ok', {duration: 3000});
    } else if (this.totalPrice === 0) {
      this.snack.open('Can\'t sell zero product', 'Ok');
    } else if (this.customerControl.value === null || this.customerControl.value === '') {
      this.snack.open('Please enter customer name', 'Ok', {duration: 3000});
    } else if (this.cartDatasourceArray.length === 50) {
      this.snack.open('Cart can accommodate only 50 products at once save them or sale them first then add another products',
        'Ok', {duration: 3000});
    } else {
      if (this.activeTab !== 0) {
        this.activeTab = 0;
      }
      const showTotalPrice = this.showTotalPrice();
      this.cartDatasourceArray.push({
        product: this.stock.product,
        quantity: showTotalPrice.quantity,
        amount: showTotalPrice.amount,
        discount: this.discountControlInput.value,
        stock: this.stock,
      });
      this.cartDatasource = new MatTableDataSource(this.cartDatasourceArray);
      this.cartDatasource.paginator = this.paginator;
      this.updateTotalBill();
      this.clearInputs();
    }
  }

  removeItemFromCart(element: CartI) {
    this.cartDatasourceArray = this.cartDatasourceArray.filter(value => value !== element);
    this.cartDatasource = new MatTableDataSource(this.cartDatasourceArray);
    this.cartDatasource.paginator = this.paginator;
    this.updateTotalBill();
  }

  updateSelectedStock(st: Stock) {
    this.stock = st;
    this.showTotalPrice();
  }

  submitBill() {
    this.showProgressBar();
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
        // this.printCart();
        // this.snack.open('Sales saved', 'Ok', {duration: 3000});
        this.hideProgressBar();
        this.clearCart();
      }
    });
  }

  saveOrder() {
    // this.openDialog(0);
    if (this.customerControl.value === null || this.customerControl.value === '') {
      this.snack.open('Please enter customer name to save order');
    } else {
      this.showProgressBar();
      this.saleDatabase.addOrder({
        date: SalesDatabaseService.getCurrentDate(),
        customer: this.customerControl.value,
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
    this.cartDatasource.paginator = this.paginator;
    this.updateTotalBill();
    this.snack.open('Done saving cart items items', 'Ok', {duration: 3000});
    this.customerControl.setValue('');
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
        // this.snack.open('Quantity must be number', 'Ok', {duration: 3000});
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
      this.salesDatasource.paginator = this.salePaginator;
      this.updateTotalSales();
    });
    this.saleDatabase.getAllOrders(orders => {
      this.salesOrderDatasourceArray = orders;
      this.salesOrderDatasource = new MatTableDataSource<OrderI>(this.salesOrderDatasourceArray);
      this.salesOrderDatasource.paginator = this.ordersPaginator;
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

  private openDialog(type: number): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        type: type,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 0) {
        this.snack.open('Products not printed nor saved', 'Ok', {duration: 3000});
      } else if (result === 1) {
        this.submitBill();
      } else if (result === 2) {
        console.log('sell order');
      } else {
        this.snack.open('You don\'t choose anything', 'Ok', {duration: 3000});
      }
    });
  }

  printOrder(element: OrderI) {
    this.printS.printOrder(element, value => {
      if (value === null) {
        this.snack.open('Not printed, either printer is not connected or printer software is not running, try again',
          'Ok', {duration: 3000});
        // this.openDialog(2);
      } else {
        this.snack.open('Order printed', 'Ok', {duration: 3000});
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
    this.printS.printCart(this.cartDatasourceArray, this.customerControl.value, value => {
      if (value === null) {
        this.snack.open('Printer is not connected or printer software is not running',
          'Ok', {duration: 3000});
        // this.openDialog(1);
      } else {
        this.submitBill();
        this.snack.open('Cart printed and saved', 'Ok', {duration: 3000});
        // this.submitBill();
      }
    });
  }

  editOrder(element: OrderI) {
    // this.cartDatasourceArray = element.cart;
    //
    // this.updateTotalBill();
    this.showProgressBar();
    this.saleDatabase.deleteOrder(element, value => {
      if (value === null) {
        this.snack.open('Failed to get order details check your internet connection',
          'Ok', {duration: 3000});
        this.hideProgressBar();
      } else {
        this.activeTab = 0;
        // const showTotalPrice = this.showTotalPrice();
        this.cartDatasourceArray = element.cart;
        this.cartDatasource = new MatTableDataSource(this.cartDatasourceArray);
        this.cartDatasource.paginator = this.paginator;
        this.updateTotalBill();
        this.clearInputs();
        this.customerControl.setValue(element.customer);
        this.hideProgressBar();
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

  done(ans: number) {
    this.dialogRef.close(ans);
  }
}
