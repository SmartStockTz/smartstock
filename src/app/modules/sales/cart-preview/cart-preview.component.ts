import {Component, Input, OnInit} from '@angular/core';
import {SsmEvents} from '../../../utils/eventsNames';
import {Stock} from '../../../model/stock';
import {EventApiService} from '../../../services/event-api.service';
import {SaleUtilsService} from '../../../services/sale-utils.service';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-cart-preview',
  templateUrl: './cart-preview.component.html',
  styleUrls: ['./cart-preview.component.css'],
  providers: [
    SaleUtilsService
  ]
})
export class CartPreviewComponent implements OnInit {
  totalCost = 0;
  totalItems = 0;
  @Input() isWholeSale = false;
  @Input() cartSidenav: MatSidenav;

  // cartItems: { quantity: number; product: Stock }[] = [];

  constructor(private readonly eventApi: EventApiService,
              private readonly _saleUtils: SaleUtilsService) {
  }

  ngOnInit() {
    this._cartEventsListen();
    this._clearCartListener();
  }

  private _cartEventsListen() {
    this.eventApi.listen(SsmEvents.CART_ITEMS, (data) => {
      if (data && data.detail) {
        const cartItems = data.detail;
        // } else {
        // this.cartItems.forEach((cart, index) => {
        //   console.log(cartItem);
        //   console.log(cart);
        //   if (cart.product.objectId === cartItem.product.objectId) {
        //     cart.quantity = cart.quantity + cartItem.quantity;
        //     this.cartItems[index] = cart;
        //   } else {
        //     this.cartItems.push(cartItem);
        //   }
        // });
        //  }
        // this._mergeCartItems(this.cartItems);
        this._findTotalItem(cartItems);
        this._findTotalCost(cartItems);
      } else {
        console.warn('unknown event');
      }
    });
  }

  private _mergeCartItems(cartItems: { quantity: number, product: Stock }[]) {
    // const intermediateCartItems: { quantity: number, product: Stock }[] = [];
    // cartItems.forEach(cart => {
    //   if (intermediateCartItems.length === 0) {
    //     intermediateCartItems.push(cart);
    //   } else {
    //     let pushed = false;
    //     intermediateCartItems.forEach((intermediateCart, index, array) => {
    //       if (intermediateCart.product.objectId === cart.product.objectId) {
    //         intermediateCart.quantity = intermediateCart.quantity + cart.quantity;
    //         array[index] = intermediateCart;
    //         pushed = true;
    //       }
    //     });
    //     if (!pushed) {
    //       intermediateCartItems.push(cart);
    //     }
    //   }
    // });
    // this.cartItems = intermediateCartItems;
  }

  private _findTotalCost(cartItems: { quantity: number, product: Stock }[]) {
    this.totalCost = this._saleUtils.findTotalCartCost(cartItems, this.isWholeSale);
  }

  private _findTotalItem(cartItems: { quantity: number, product: Stock }[]) {
    this.totalItems = this._saleUtils.findTotalCartItem(cartItems);
  }

  showMainCart() {
    this.cartSidenav.opened = true;
    // this._sheet.open(CartBottomSheetComponent, {
    //   data: {
    //     carts: this.cartItems,
    //     isWholeSale: this.isWholeSale
    //   }
    // }).afterDismissed().subscribe(value => {
    //   if (value && Array.isArray(value)) {
    //     this.cartItems = value;
    //     this._findTotalCost(this.cartItems);
    //     this._findTotalItem(this.cartItems);
    //   } else {
    //     this._findTotalCost(this.cartItems);
    //     this._findTotalItem(this.cartItems);
    //   }
    // });
  }

  private _clearCartListener() {
    this.eventApi.listen(SsmEvents.NO_OF_CART, data => {
      this.totalItems = data.detail;
    });
  }
}
