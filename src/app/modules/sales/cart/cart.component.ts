import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {EventApiService} from 'src/app/services/event-api.service';
import {UserModel} from 'bfastjs/dist/src/model/UserModel';
import {SalesDatabaseService} from '../../../services/sales-database.service';
import {PrintServiceService} from '../../../services/print-service.service';
import {UserDatabaseService} from '../../../services/user-database.service';
import {SettingsService} from '../../../services/settings.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SsmEvents} from '../../../utils/eventsNames';
import {SalesModel} from '../../../model/CashSale';
import {CartModel} from '../../../model/cart';
import {Stock} from '../../../model/stock';
import {toSqlDate} from '../../../utils/date';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [
    SalesDatabaseService,
    SettingsService
  ]
})
export class CartComponent implements OnInit {

  constructor(private readonly eventService: EventApiService,
              private readonly saleDatabase: SalesDatabaseService,
              private readonly settings: SettingsService,
              private readonly printer: PrintServiceService,
              private readonly userApi: UserDatabaseService,
              private readonly snack: MatSnackBar) {
  }

  @Input() isViewedInWholesale = false;
  @Input() cartdrawer: MatSidenav;

  totalCost = 0;
  discountFormControl = new FormControl(0, [Validators.nullValidator, Validators.min(0)]);
  customerFormControl = new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(3)]);
  customers: Observable<string[]>;
  customersArray: string[];
  cartProductsArray: { quantity: number, product: Stock }[] = [];
  cartProducts: Observable<{ quantity: number, product: Stock }[]> = of(this.cartProductsArray);
  checkoutProgress = false;
  private currentUser: UserModel;

  private static _getCartItemDiscount(data: { totalDiscount: number, totalItems: number }): number {
    return (data.totalDiscount / data.totalItems);
  }

  ngOnInit() {
    this.getUser();
    this._cartListener();
    this._discountListener();
    this._hideCartListener();
    this._handleCustomerNameControl();
  }

  private getUser() {
    this.userApi.currentUser()
      .then(value => {
        this.currentUser = value;
      })
      .catch(_ => {
        this.currentUser = undefined;
      });
  }

  private _handleCustomerNameControl() {
    this.customersArray = [];
    this.customerFormControl.valueChanges.subscribe((value: string) => {
      if (value) {
        this.customers = of(this.customersArray.filter(value1 => value1.toLowerCase().startsWith(value.toLowerCase())));
      }
    });
  }

  private _cartListener() {
    this.eventService.listen(SsmEvents.CART, (event) => {
      const cart = event.detail;
      const updateItem = this.cartProductsArray.find(x => x.product.objectId === cart.product.objectId);
      if (updateItem != null) {
        const index = this.cartProductsArray.indexOf(updateItem);
        this.cartProductsArray[index].quantity = this.cartProductsArray[index].quantity + cart.quantity;
      } else {
        this.cartProductsArray.push(cart);
      }
      this.cartProducts = of(this.cartProductsArray);
      this.eventService.broadcast(SsmEvents.NO_OF_CART, this.cartProductsArray.length);
      this._getTotal(this.discountFormControl.value);
    });
  }

  private _getTotal(discount: number) {
    if (discount != null) {
      this.totalCost = this.cartProductsArray
        .map<number>(value => {
          return value.quantity * (this.isViewedInWholesale ? value.product.wholesalePrice : value.product.retailPrice) as number;
        })
        .reduce((a, b) => {
          return a + b;
        }, -discount);
    }
    this.eventService.broadcast(SsmEvents.NO_OF_CART, this.cartProductsArray.length);
  }

  decrementQty(indexOfProductInCart: number) {
    this.cartProducts.subscribe(cart => {
      if (cart[indexOfProductInCart].quantity > 1) {
        cart[indexOfProductInCart].quantity = cart[indexOfProductInCart].quantity - 1;
      }
    });
    this._getTotal(this.discountFormControl.value ? this.discountFormControl.value : 0);
  }

  incrementQty(indexOfProductInCart: number) {
    this.cartProducts.subscribe(cart => {
      cart[indexOfProductInCart].quantity = cart[indexOfProductInCart].quantity + 1;
    });
    this._getTotal(this.discountFormControl.value ? this.discountFormControl.value : 0);
  }

  removeCart(indexOfProductInCart: number) {
    this.cartProductsArray.splice(indexOfProductInCart, 1);
    this.cartProducts = of(this.cartProductsArray);
    this._getTotal(this.discountFormControl.value ? this.discountFormControl.value : 0);

  }

  private _discountListener() {
    this.discountFormControl.valueChanges.subscribe(value => {
      if (!value) {
        this._getTotal(0);
      }
      if (!isNaN(value)) {
        this._getTotal(value);
      }
    });
  }

  private _hideCartListener() {
    this.eventService.listen(SsmEvents.NO_OF_CART, (data) => {
      if (!data && !data.detail) {
        this.cartdrawer.opened = false;
      }
      if (!isNaN(data.detail) && data.detail === 0) {
        this.cartdrawer.opened = false;
      }
    });
  }

  checkout() {
    if (this.isViewedInWholesale && !this.customerFormControl.valid) {
      this.snack.open('Please enter customer name, atleast three characters required', 'Ok', {
        duration: 3000
      });
      return;
    }
    this.checkoutProgress = true;
    this.printCart()
      .then(_ => {
        this.checkoutProgress = false;
      })
      .catch(_ => {
        this.checkoutProgress = false;
      });
  }

  private _getCartItemSubAmount(cart: { quantity: number, product: Stock, totalDiscount: number, totalItems: number }): number {
    const amount = this.isViewedInWholesale
      ? (cart.quantity * cart.product.wholesalePrice)
      : (cart.quantity * cart.product.retailPrice);
    return amount - CartComponent._getCartItemDiscount({totalDiscount: cart.totalDiscount, totalItems: cart.totalItems});
  }

  async submitBill() {
    // this.checkoutProgress = true;
    const sales: SalesModel[] = this._getSalesBatch();
    await this.saleDatabase.saveSales(sales);
    // .then(_ => {
    // this.checkoutProgress = false;
    this.cartProductsArray = [];
    this.cartProducts = of([]);
    this.customerFormControl.setValue(null);
    this._getTotal(0);
    this.snack.open('Done save sales', 'Ok', {duration: 2000});
    //  }).catch(_ => {
    //     this.checkoutProgress = false;
    //     this.snack.open('Checkout process fails, try again', 'Ok', {duration: 3000});
    //  });
  }

  async printCart() {
    try {
      const settings = await this.settings.getSettings();
      if (!environment.production || settings && settings.saleWithoutPrinter) {
        await this.submitBill();
      } else {
        const cartItems = this._getCartItems();
        await this.printer.print(
          cartItems,
          this.isViewedInWholesale
            ? this.customerFormControl.value
            : null
        );
        // .then(_ => {
        await this.submitBill();
        // this.snack.open('Cart printed and sales', 'Ok', {duration: 3000});
        // }).catch(reason => {
        //  console.log(reason);
        //  this.snack.open('Printer is not connected or printer software is not running',
        //    'Ok', {duration: 3000});
        // });
      }
    } catch (reason) {
      // console.error(reason);
      this.snack.open('Fails to complete your sales request, try again', 'Ok', {
        duration: 3000
      });
    }
  }

  private _getCartItems(): CartModel[] {
    return this.cartProductsArray.map<CartModel>(value => {
      return {
        amount: this._getCartItemSubAmount({
          totalItems: this.cartProductsArray.length,
          totalDiscount: this.discountFormControl.value,
          product: value.product,
          quantity: value.quantity
        }),
        product: value.product.product,
        quantity: value.quantity,
        stock: value.product,
        discount: CartComponent._getCartItemDiscount({
          totalItems: this.cartProductsArray.length,
          totalDiscount: this.discountFormControl.value,
        })
      };
    });
  }

  private _getSalesBatch(): SalesModel[] {
    const stringDate = toSqlDate(new Date());
    const idTra = 'n';
    const channel = this.isViewedInWholesale ? 'whole' : 'retail';
    const sales: SalesModel[] = [];
    this.cartProductsArray.forEach(value => {
      sales.push({
        amount: this._getCartItemSubAmount({
          totalItems: this.cartProductsArray.length,
          totalDiscount: this.discountFormControl.value,
          product: value.product,
          quantity: value.quantity
        }),
        discount: CartComponent._getCartItemDiscount({
          totalItems: this.cartProductsArray.length,
          totalDiscount: this.discountFormControl.value,
        }),
        quantity: this.isViewedInWholesale
          ? (value.quantity * value.product.wholesaleQuantity)
          : value.quantity,
        product: value.product.product,
        category: value.product.category,
        unit: value.product.unit,
        channel: channel,
        date: stringDate,
        idTra: idTra,
        customer: this.isViewedInWholesale
          ? this.customerFormControl.value
          : null,
        user: this.currentUser?.objectId,
        stock: value.product,
        stockId: value.product.objectId
      });
    });
    return sales;
  }
}
