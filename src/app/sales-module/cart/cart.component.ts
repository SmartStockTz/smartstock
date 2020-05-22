import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {EventApiService} from 'src/app/services/event-api.service';
import {SsmEvents} from '../../utils/eventsNames';
import {Stock} from '../../model/stock';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  @Input() isViewedInWholesale = false;
  @Input() cartdrawer: MatSidenav;

  totalCost = 0;
  discountFormControl = new FormControl(0, [Validators.nullValidator, Validators.min(0)]);
  customerFormControl = new FormControl('', [Validators.nullValidator]);
  filteredOptions: Observable<string[]>;
  cartProductsArray: { quantity: number, product }[] = [];
  cartProducts: Observable<{ quantity: number, product: Stock }[]> = of([]);

  constructor(private readonly eventService: EventApiService) {
  }

  ngOnInit() {
    this._cartListener();
    this._discountListener();
    this._hideCartListener();
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
}
