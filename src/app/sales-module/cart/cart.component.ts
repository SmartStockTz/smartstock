import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {EventApiService} from 'src/app/services/event-api.service';
import {SsmEvents} from '../../utils/eventsNames';
import {Stock} from '../../model/stock';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  customerFormControl = new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(3)]);
  customers: Observable<string[]>;
  customersArray: string[];
  cartProductsArray: { quantity: number, product }[] = [];
  cartProducts: Observable<{ quantity: number, product: Stock }[]> = of([]);

  constructor(private readonly eventService: EventApiService,
              private readonly snack: MatSnackBar) {
  }

  ngOnInit() {
    this._cartListener();
    this._discountListener();
    this._hideCartListener();
    this._handleCustomerNameControl();
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
  }

  // submitBill() {
  //   this.showProgressBar();
  //   const stringDate = toSqlDate(new Date());
  //   let idTra: string;
  //   let channel: string;
  //   if (this.traRadioControl.value === false) {
  //     idTra = 'n';
  //   } else {
  //     idTra = 'n/n';
  //   }
  //   if (this.nhifRadioInput.value === true) {
  //     channel = 'nhif';
  //   } else {
  //     channel = 'retail';
  //   }
  //   const saleM: CashSaleI[] = [];
  //   this.cartDatasourceArray.forEach(value => {
  //     saleM.push({
  //       amount: value.amount,
  //       discount: value.discount,
  //       quantity: value.quantity,
  //       product: value.product,
  //       category: value.stock.category,
  //       unit: value.stock.unit,
  //       channel: channel,
  //       date: stringDate,
  //       idTra: idTra,
  //       user: this.currentUser.objectId,
  //       batch: randomString(12),
  //       stock: value.stock,
  //       stockId: value.stock.objectId// for reference only
  //     });
  //   });
  //
  //   this.saleDatabase.addAllCashSale(saleM).then(value => {
  //     this.hideProgressBar();
  //     // this.printCart();
  //     this.cartDatasourceArray = [];
  //     this.cartDatasource = new MatTableDataSource(this.cartDatasourceArray);
  //     this.cartDatasource.paginator = this.paginator;
  //     this.updateTotalBill();
  //     // this.snack.open('Done save sales', 'Ok', {duration: 3000});
  //   }).catch(reason => {
  //     this.saleDatabase.addCashSaleToCache(this.cartDatasourceArray, value1 => {
  //     });
  //     this.snack.open('Product not saved, try again', 'Ok');
  //     this.hideProgressBar();
  //   });
  // }
  //
  // async printCart() {
  //   try {
  //     this.printProgress = true;
  //     const settings = await this.settings.getSettings();
  //     if (!environment.production || settings && settings.saleWithoutPrinter) {
  //       this.submitBill();
  //       this.snack.open('Cart saved successful', 'Ok', {
  //         duration: 3000
  //       });
  //       this.printProgress = false;
  //     } else {
  //       this.printS.printCartRetail(this.cartDatasourceArray, this.currentUser.username).then(_ => {
  //         this.submitBill();
  //         this.snack.open('Cart printed and saved', 'Ok', {duration: 3000});
  //         this.printProgress = false;
  //       }).catch(reason => {
  //         console.log(reason);
  //         this.snack.open('Printer is not connected or printer software is not running',
  //           'Ok', {duration: 3000});
  //         this.printProgress = false;
  //       });
  //     }
  //   } catch (reason) {
  //     console.error(reason);
  //     this.snack.open('General failure when try to submit your sales, contact support', 'Ok', {
  //       duration: 5000
  //     });
  //   }
  // }

}
