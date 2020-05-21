import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { EventApiService } from 'src/app/services/event-api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  @Input() isViewedInWholesale = false;
  @Input() cartdrawer: MatSidenav;

  totalCost = 0;
  discountFormControl = new FormControl('', [Validators.nullValidator, Validators.min(0)]);
  customerFormControl = new FormControl('', [Validators.nullValidator]);
  filteredOptions: Observable<string[]>;
  cartProductsArray: { quantity: number, product }[] = [];
  cartProducts: Observable<{ quantity: number, product }[]> = of([]);

  constructor(private readonly eventService: EventApiService) { }

  ngOnInit() {
    this._addCart();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } 
    this._getTotal(this.discountFormControl.value);
    return true;
  }
  private _addCart() {
    window.addEventListener('add_cart', (event) => {
      // @ts-ignore
      const cart = event.detail;
       let updateItem = this.cartProductsArray.find(x=>x.product.objectId === cart.product.objectId);
       if(updateItem != null){
        let index = this.cartProductsArray.indexOf(updateItem);
        this.cartProductsArray[index].quantity = this.cartProductsArray[index].quantity + cart.quantity;
       } else {
        this.cartProductsArray.push(cart)
       }
      this.cartProducts = of(this.cartProductsArray);
      this.eventService.broadcast('noofProductsCart', this.cartProductsArray.length);
      this._getTotal(this.discountFormControl.value);
    });
  }

   _getTotal(discount: number){
    let cost = 0;
    if(discount != null) {
    this.cartProductsArray.forEach(cart=>{
      cost += (cart.quantity * cart.product.retailPrice)
    });
    this.totalCost = cost - Number(discount);

    }
  }

  decrementQty(value) {
    this.cartProducts.subscribe(cart => {
      if (cart[value].quantity  > 0) {
        cart[value].quantity = cart[value].quantity - 1;
      }
    })
    this._getTotal(this.discountFormControl.value?this.discountFormControl.value:0);
  }

  incrementQty(value) {
    this.cartProducts.subscribe(cart => {
      cart[value].quantity = cart[value].quantity + 1;
    })
    this._getTotal(this.discountFormControl.value?this.discountFormControl.value:0);
  }

  removeCart(index: number) {
    console.log(index);
    // this.cartProducts = undefined;
    this.cartProductsArray.splice(index,1);
    this.cartProducts = of(this.cartProductsArray);
    this._getTotal(this.discountFormControl.value?this.discountFormControl.value:0);
  }
}
