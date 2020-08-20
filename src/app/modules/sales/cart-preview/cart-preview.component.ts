import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {SsmEvents} from '../../../utils/eventsNames';
import {EventApiService} from '../../../services/event-api.service';
import {SaleUtilsService} from '../../../services/sale-utils.service';
import {MatSidenav} from '@angular/material/sidenav';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {StockModel} from '../../stocks/models/stock.model';

@Component({
  selector: 'app-cart-preview',
  templateUrl: './cart-preview.component.html',
  styleUrls: ['./cart-preview.component.css'],
  providers: [
    SaleUtilsService
  ]
})
export class CartPreviewComponent extends DeviceInfo implements OnInit {
  totalCost = 0;
  totalItems: Observable<number> = of(0);
  @Input() isWholeSale = false;
  @Input() cartSidenav: MatSidenav;
  isMobile = environment.android;

  constructor(private readonly eventApi: EventApiService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly _saleUtils: SaleUtilsService) {
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
