import {Injectable} from '@angular/core';
import {Stock} from '../model/stock';

@Injectable()
export class SaleUtilsService {
  findTotalCartCost(cartItems: { quantity: number, product: Stock }[], isWholeSale: boolean) {
    let totalCost: number;
    if (isWholeSale) {
      const mapped = cartItems.map(
        (cart => cart.quantity * cart.product.wholesaleQuantity * this.findCartItemUnitPrice(cart, isWholeSale))
      );
      totalCost = mapped.reduce((a, b) => a + b, 0);
    } else {
      const mapped = cartItems.map((cart => cart.quantity * cart.product.retailPrice));
      totalCost = mapped.reduce((a, b) => a + b, 0);
    }
    return totalCost;
  }

  findCartItemUnitPrice(cart: { quantity: number, product: Stock }, isWholeSale: boolean) {
    if (isWholeSale) {
      return cart.product.wholesalePrice / cart.product.wholesaleQuantity;
    } else {
      return cart.product.retailPrice;
    }
  }

  findTotalCartItem(cartItems: { quantity: number, product: Stock }[]) {
    const mapped = cartItems.map(value => value.quantity);
    return mapped.reduce((a, b) => a + b, 0);
  }

  findCartItemAmount(cart: { quantity: number, product: Stock }, isWholeSale: boolean) {
    if (isWholeSale) {
      return this.findCartItemUnitPrice(cart, isWholeSale) * cart.quantity * cart.product.wholesaleQuantity;
    } else {
      return cart.quantity * cart.product.retailPrice;
    }
  }

  findCartItemQuantity(cart: { quantity: number, product: Stock }, isWholeSale: boolean) {
    if (isWholeSale) {
      return cart.quantity * cart.product.wholesaleQuantity;
    } else {
      return cart.quantity;
    }
  }
}
