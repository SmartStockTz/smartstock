import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {EventService} from '@smartstocktz/core-libs';
import {UtilsService} from '../services/utils.service';
import {MatSidenav} from '@angular/material/sidenav';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {StockModel} from '../models/stock.model';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {SsmEvents} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-cart-preview',
  template: `
    <div style="padding: 16px" [ngClass]="isMobile?'fixed-bottom':!enoughWidth()?'fixed-bottom-web-enough-width':'fixed-bottom-web'"
         *ngIf="(totalItems | async)  > 0">
      <button (click)="showMainCart()" mat-flat-button class="ft-button btn-block" color="primary">
        {{totalItems | async | number}} Items = {{totalCost | currency: 'TZS '}}
      </button>
    </div>
  `,
  styleUrls: ['../styles/cart-preview.style.css'],
  providers: [
    UtilsService
  ]
})
export class CartPreviewComponent extends DeviceInfoUtil implements OnInit {
  totalCost = 0;
  totalItems: Observable<number> = of(0);
  @Input() isWholeSale = false;
  @Input() cartSidenav: MatSidenav;
  isMobile = environment.android;

  constructor(private readonly eventApi: EventService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly _saleUtils: UtilsService) {
    super();
  }

  ngOnInit() {
    this._cartEventsListen();
    this._clearCartListener();
  }

  private _cartEventsListen() {
    this.eventApi.listen(SsmEvents.CART_ITEMS, (data) => {
      if (data && data.detail) {
        const cartItems = data.detail;
        this._findTotalCost(cartItems);
      } else {
        console.warn('unknown event');
      }
    });
  }

  private _findTotalCost(cartItems: { quantity: number, product: StockModel }[]) {
    this.totalCost = this._saleUtils.findTotalCartCost(cartItems, this.isWholeSale);
  }

  showMainCart() {
    this.cartSidenav.opened = true;
  }

  private _clearCartListener() {
    this.eventApi.listen(SsmEvents.NO_OF_CART, data => {
      this.totalItems = of(data.detail);
      this.changeDetectorRef.detectChanges();
    });
  }
}
