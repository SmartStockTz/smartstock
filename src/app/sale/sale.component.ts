import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav, MatSnackBar, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Stock} from '../model/stock';
import {NgForage} from 'ngforage';
import {UserI} from '../model/UserI';
import {UserDatabaseService} from '../services/user-database.service';
import {Observable, of} from 'rxjs';
import {CartI} from '../model/cart';
import {SalesDatabaseService} from '../services/sales-database.service';
import {CashSaleI} from '../model/CashSale';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  private currentUser: UserI;
  isAdmin = false;
  isLogin = false;
  showProgress = false;
  totalPrice = 0;
  priceUnit = 0;
  changePrice = 0;
  totalBill = 0;
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
    id: '',
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

  constructor(private router: Router,
              private userDatabase: UserDatabaseService,
              private indexDb: NgForage,
              private snack: MatSnackBar,
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
    this.sidenav.open()
      .then(value => {
        console.log(value);
      }).catch(reason => {
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
        product: this.productNameControlInput.value,
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
    const cartIS = this.cartDatasourceArray.filter(value => value !== element);
    this.cartDatasourceArray = cartIS;
    this.cartDatasource = new MatTableDataSource(this.cartDatasourceArray);
    this.updateTotalBill();
  }

  updateSelectedStock(st: Stock) {
    this.stock = st;
    this.showTotalPrice();
  }

  submitBill() {
    this.showProgressBar();
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const stringDate = year + '-' + month + '-' + day;
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
        channel: 'retail',
        date: stringDate,
        id: '',
        idTra: idTra,
        user: this.currentUser.id
      });
    });
    this.saleDatabase.addCashSale(saleM)
      .then(value => {
        console.log(value);
        this.hideProgressBar();
        this.cartDatasourceArray = [];
        this.cartDatasource = new MatTableDataSource(this.cartDatasourceArray);
        this.updateTotalBill();
        this.snack.open('Done save the cart', 'Ok', {duration: 3000});
      })
      .catch(reason => {
        console.log(reason);
        this.snack.open(reason, 'Ok');
      });
  }

  private clearInputs() {
    this.productNameControlInput.setValue('');
    this.quantityControlInput.setValue(0);
    this.discountControlInput.setValue(0);
    this.retailWholesaleRadioInput.setValue(false);
    this.nhifRadioInput.setValue(false);
    this.receiveControlInput.setValue(0);
    this.changePrice = 0;
    this.totalPrice = 0;
    this.priceUnit = 0;
    this.stock.shelf = '';
  }

  private showProgressBar() {
    this.showProgress = true;
  }

  private hideProgressBar() {
    this.showProgress = false;
  }

  private initializeView() {
    this.retailWholesaleRadioInput.setValue(false);
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
    this.retailWholesaleRadioInput.valueChanges.subscribe(value => {
      this.showTotalPrice();
    }, error1 => {
      console.log(error1);
    });
    // live database
    this.saleDatabase.getAllCashSaleOfUser(this.currentUser.id, datasource => {
      this.saleDatasourceArray = [];
      this.saleDatasourceArray = datasource;
      this.salesDatasource = new MatTableDataSource(this.saleDatasourceArray);
      this.updateTotalSales();
    });
  }

  private showChanges() {
    this.changePrice = this.receiveControlInput.value - this.totalPrice;
  }

  private showTotalPrice(): { quantity: number, amount: number } {
    if (this.retailWholesaleRadioInput.value === false) {
      this.priceUnit = this.stock.retailPrice;
      this.totalPrice = (this.quantityControlInput.value * this.stock.retailPrice) - (<number>this.discountControlInput.value);
      return {amount: this.totalPrice, quantity: this.quantityControlInput.value};
    } else {
      this.priceUnit = this.stock.retailWholesalePrice;
      const a: number = (Number(this.quantityControlInput.value) * Number(this.stock.wholesaleQuantity));
      this.totalPrice = (a * <number>this.stock.retailWholesalePrice) - <number>this.discountControlInput.value;
      return {amount: this.totalPrice, quantity: a};
    }
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
}
