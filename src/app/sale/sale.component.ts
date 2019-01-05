import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav, MatSnackBar, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Stock} from '../model/stock';
import {NgForage} from 'ngforage';
import {UserI} from '../model/UserI';
import {UserDatabaseService} from '../services/user-database.service';
import {Observable, of} from 'rxjs';
import {CartI} from '../model/cart';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  isAdmin = false;
  isLogin = false;
  totalPrice = 0;
  priceUnit = 0;
  changePrice = 0;
  totalBill = 0;
  @ViewChild('sidenav') sidenav: MatSidenav;
  productNameControlInput = new FormControl();
  receiveControlInput = new FormControl();
  quantityControlInput = new FormControl();
  discountControlInput = new FormControl();
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
  retailWholesaleRadioInput = new FormControl();
  nhifRadioInput = new FormControl();
  cartDatasourceArray: CartI[];
  cartDatasource: MatTableDataSource<CartI>;
  cartColums = ['product', 'quantity', 'amount', 'discount', 'action'];
  traRadioControl = new FormControl();

  constructor(private router: Router,
              private userDatabase: UserDatabaseService,
              private indexDb: NgForage,
              private snack: MatSnackBar,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.indexDb.getItem<UserI>('user').then(value => {
      if (value === null) {
        this.isLogin = false;
        this.router.navigateByUrl('login').catch(reason => console.log(reason));
      } else {
        this.isAdmin = value.role === 'admin';
        this.isLogin = true;
      }
    }).catch(reason => {
      console.log(reason);
    });

    // control input initialize
    this.initializeView();
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
    } else {
      const showTotalPrice = this.showTotalPrice();
      this.cartDatasourceArray.push({
        product: this.productNameControlInput.value,
        quantity: showTotalPrice.quantity,
        amount: showTotalPrice.amount,
        discount: this.discountControlInput.value
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


  private initializeView() {
    this.retailWholesaleRadioInput.setValue(false);
    this.nhifRadioInput.setValue(false);
    this.discountControlInput.setValue(0);
    this.receiveControlInput.setValue(0);
    this.productNameControlInput.valueChanges.subscribe(value => {
      this.getProduct(value);
    }, error1 => {
      console.log(error1);
    });
    this.cartDatasourceArray = [];

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

}
