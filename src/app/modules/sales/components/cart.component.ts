import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {EventService} from 'src/app/modules/lib/services/event.service';
import {SalesState} from '../states/sales.state';
import {UserDatabaseService} from '../../account/services/user-database.service';
import {SettingsService} from '../../account/services/settings.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SalesModel} from '../models/sale.model';
import {CartModel} from '../models/cart.model';
import {environment} from '../../../../environments/environment';
import {CustomerState} from '../states/customer.state';
import {PrintService} from '../services/print.service';
import {StockModel} from '../models/stock.model';
import {SsmEvents} from '../../lib/utils/eventsNames.util';
import {SecurityUtil} from '../../lib/utils/security.util';
import {toSqlDate} from '../../lib/utils/date.util';

@Component({
  selector: 'smartstock-cart',
  template: `
    <div id="cart_view" [ngClass]="isMobile?'cart-mobile':'cart'">

      <mat-toolbar class="mat-elevation-z3" style="z-index: 10000">

        <span [matBadge]="getTotalCartItem().toString()" matBadgeOverlap="false">Cart</span>
        <span style="flex-grow: 1;"></span>
        <button mat-icon-button (click)="cartdrawer.toggle()" style="float: right;">
          <mat-icon>close</mat-icon>
        </button>

      </mat-toolbar>

      <div style="padding: 5px 0 0 0" *ngIf="isViewedInWholesale">
        <div style="width: 100%; padding: 6px">
          <input autocomplete="false"
                 style="border: none; background-color: rgba(0, 170, 7, 0.1);
             padding: 4px; border-radius: 4px;width: 100%; height: 48px;"
                 [formControl]="customerFormControl" placeholder="Customer Name"
                 type="text" [matAutocomplete]="auto">

          <mat-autocomplete #auto="matAutocomplete">
            <mat-option *ngFor="let option of customers | async" [value]="option">
              {{option}}
            </mat-option>
          </mat-autocomplete>
        </div>
      </div>

      <div style="margin-bottom: 300px">
        <mat-list>
          <div *ngFor="let cart of cartProducts | async; let i=index">
            <mat-list-item>
              <button (click)="removeCart(i)" matSuffix mat-icon-button>
                <mat-icon color="warn">delete</mat-icon>
              </button>
              <h4 matLine>{{cart.product.product}}</h4>
              <mat-card-subtitle
                matLine>{{isViewedInWholesale ? '(' + cart.product.wholesaleQuantity + ') ' : ''}}{{cart.quantity}} {{cart.product.unit}}
                @{{isViewedInWholesale ? cart.product.wholesalePrice : cart.product.retailPrice}}
                = {{cart.quantity * (isViewedInWholesale ? cart.product.wholesalePrice : cart.product.retailPrice) | number}}
              </mat-card-subtitle>
              <div class="d-flex flex-row" matLine>
                <button color="primary" (click)="decrementQty(i)" mat-icon-button>
                  <mat-icon>remove_circle</mat-icon>
                </button>
                <button color="primary" (click)="incrementQty(i)" mat-icon-button>
                  <mat-icon>add_circle</mat-icon>
                </button>
              </div>
            </mat-list-item>
            <mat-divider style="margin-left: 5%; margin-right: 5%"></mat-divider>
          </div>
        </mat-list>
      </div>

      <div style="padding: 8px 8px 16px 8px;bottom: 0;width: 100%;position: absolute;background-color: white;z-index: 1000;">
        <mat-divider style="margin-bottom: 7px"></mat-divider>
        <div class="cart-total">
          <h6 style="display: flex;">
            <span style="flex-grow: 1;">Total</span>
            <span>{{totalCost | currency: 'TZS '}}</span>
          </h6>
          <p style="color: #868688;display: flex;">
            <span style="flex-grow: 1;">Discount( TZS )</span>
            <input autocomplete="false"
                   style="border: none; text-align: center;background-color: rgba(0, 170, 7, 0.1);
                border-radius: 4px;width: 125px; height: 35px;"
                   type="number" min="0" [formControl]="discountFormControl">
          </p>
        </div>
        <button [disabled]="checkoutProgress" (click)="checkout()"
                style="width: 100%;text-align:left;height: 54px;font-size: 20px" color="primary"
                mat-raised-button>
          <span *ngIf="!checkoutProgress">Checkout</span>
          <mat-progress-spinner color="primary" *ngIf="checkoutProgress" mode="indeterminate" diameter="25"
                                style="display: inline-block"></mat-progress-spinner>
          <span style="float: right;">{{totalCost | currency: 'TZS '}}</span>
        </button>
      </div>

    </div>
  `,
  styleUrls: ['../styles/cart.style.css'],
  providers: [
    SalesState,
    SettingsService
  ]
})
export class CartComponent implements OnInit {

  constructor(private readonly eventService: EventService,
              private readonly saleDatabase: SalesState,
              private readonly settings: SettingsService,
              private readonly printer: PrintService,
              private readonly userApi: UserDatabaseService,
              private readonly customerApi: CustomerState,
              private readonly snack: MatSnackBar) {
  }

  @Input() isViewedInWholesale = false;
  @Input() cartdrawer: MatSidenav;

  totalCost = 0;
  discountFormControl = new FormControl(0, [Validators.nullValidator, Validators.min(0)]);
  customerFormControl = new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(3)]);
  customers: Observable<string[]>;
  customersArray: string[];
  cartProductsArray: { quantity: number, product: StockModel }[] = [];
  cartProducts: Observable<{ quantity: number, product: StockModel }[]> = of(this.cartProductsArray);
  checkoutProgress = false;
  private currentUser: any;
  isMobile = environment.android;

  private static _getCartItemDiscount(data: { totalDiscount: number, totalItems: number }): number {
    return (data.totalDiscount / data.totalItems);
  }

  private static getQuantity(isViewedInWholesale: boolean, cart: CartModel) {
    return isViewedInWholesale ? (cart.quantity * cart.stock.wholesaleQuantity) : cart.quantity;
  }

  private static getPrice(isViewedInWholesale: boolean, cart: CartModel) {
    return isViewedInWholesale ? cart.stock.wholesalePrice : cart.stock.retailPrice;
  }

  ngOnInit() {
    this.getUser();
    this._cartListener();
    this._discountListener();
    this._hideCartListener();
    this._handleCustomerNameControl();
    this._getCustomers();
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
    this.customerFormControl.valueChanges.subscribe((enteredName: string) => {
      if (enteredName) {
        this.customerApi.getCustomers()
          .then(customers => {
            if (!customers) {
              customers = [];
            }
            this.customers = of(
              customers
                .map(customer => customer.displayName)
                .filter(value1 => value1.toLowerCase().startsWith(enteredName.toLowerCase()))
            );
          })
          .catch();
      }
    });
  }

  private _cartListener() {
    this.eventService.listen(SsmEvents.ADD_CART, (event) => {
      const cart = event.detail;
      const updateItem = this.cartProductsArray.find(x => x.product.id === cart.product.id);
      if (updateItem != null) {
        const index = this.cartProductsArray.indexOf(updateItem);
        this.cartProductsArray[index].quantity = this.cartProductsArray[index].quantity + cart.quantity;
      } else {
        this.cartProductsArray.push(cart);
      }
      this.cartProducts = of(this.cartProductsArray);
      this.eventService.broadcast(SsmEvents.CART_ITEMS, this.cartProductsArray);
      this.eventService.broadcast(
        SsmEvents.NO_OF_CART,
        this.cartProductsArray.map(cartItem => cartItem.quantity).reduce((a, b) => a + b, 0)
      );
      this._getTotal(this.discountFormControl.value);
    });
  }

  getTotalCartItem() {
    const totalCart = this.cartProductsArray.map(cartItem => cartItem.quantity).reduce((a, b) => a + b, 0);
    this.eventService.broadcast(SsmEvents.NO_OF_CART, totalCart);
    return totalCart;
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

    if (this.customerFormControl.valid) {
      this.customerApi.saveCustomer({
        displayName: this.customerFormControl.value,
      }).catch();
    }

    this.printCart();
  }

  private _getCartItemSubAmount(cart: { quantity: number, product: StockModel, totalDiscount: number, totalItems: number }): number {
    const amount = this.isViewedInWholesale
      ? (cart.quantity * cart.product.wholesalePrice)
      : (cart.quantity * cart.product.retailPrice);
    return amount - CartComponent._getCartItemDiscount({totalDiscount: cart.totalDiscount, totalItems: cart.totalItems});
  }

  async submitBill(cartId: string) {
    const sales: SalesModel[] = this._getSalesBatch();
    await this.saleDatabase.saveSales(sales, cartId);
    this.cartProductsArray = [];
    this.cartProducts = of([]);
    this.customerFormControl.setValue(null);
    this._getTotal(0);
    this.eventService.broadcast(SsmEvents.CART_ITEMS, []);
  }

  printCart() {
    this.checkoutProgress = true;
    const cartId = SecurityUtil.generateUUID();
    const cartItems = this._getCartItems();
    this.printer.print({
      data: this.cartItemsToPrinterData(cartItems, this.isViewedInWholesale ? this.customerFormControl.value : null),
      printer: environment.android ? 'jzv3' : 'tm20',
      id: cartId,
      qr: cartId
    }).then(_ => {
      return this.submitBill(cartId);
    }).then(_ => {
      this.checkoutProgress = false;
      this.snack.open('Done save sales', 'Ok', {duration: 2000});
    }).catch(reason => {
      this.checkoutProgress = false;
      this.snack.open(
        reason && reason.message ? reason.message : reason.toString(),
        'Ok',
        {duration: 3000}
      );
    });
  }

  private cartItemsToPrinterData(carts: CartModel[], customer: string): string {
    let data = '';
    data = data.concat('-------------------------------\n');
    data = data.concat(new Date().toDateString() + '\n');
    if (customer) {
      data = data.concat('-------------------------------\nTo ---> ' + customer);
    }
    let totalBill = 0;
    carts.forEach((cart, index) => {
      totalBill += <number>cart.amount;
      data = data.concat(
        '\n-------------------------------\n' +
        (index + 1) + '.  ' + cart.product + '\n' +
        'Quantity --> ' + CartComponent.getQuantity(this.isViewedInWholesale, cart) + ' ' + cart.stock.unit + ' \t' +
        'Unit Price --> ' + CartComponent.getPrice(this.isViewedInWholesale, cart) + '\t' +
        'Sub Amount  --> ' + cart.amount + ' \t'
      );
    });
    data = data.concat(
      '\n--------------------------------\n' +
      'Total Bill : ' + totalBill +
      '\n--------------------------------\n'
    );
    return data;
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
        user: this.currentUser?.id,
        stock: value.product,
        stockId: value.product.id
      });
    });
    return sales;
  }

  private _getCustomers() {
    if (!this.isViewedInWholesale) {
      return;
    }
    this.customerApi.getCustomers()
      .then(customers => {
        if (!customers) {
          customers = [];
        }
        this.customers = of(customers.map(value => value.displayName));
      })
      .catch();
  }

}
