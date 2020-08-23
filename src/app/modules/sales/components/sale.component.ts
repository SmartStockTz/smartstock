import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {SalesState} from '../states/sales.state';
/*********** move to common ***********/
import {StorageService} from '../../lib/services/storage.service';
/*********** move to common ***********/
import {UserDatabaseService} from '../../account/services/user-database.service';
import {MatSnackBar} from '@angular/material/snack-bar';
/*********** move to common ***********/
/*********** move to common ***********/
import {environment} from '../../../../environments/environment';
import {FormControl} from '@angular/forms';
/*********** move to common ***********/
/*********** move to common ***********/
import {StockModel} from '../models/stock.model';
import {EventService} from '../../lib/services/event.service';
import {LogService} from '../../lib/services/log.service';
import {DeviceInfoUtil} from '../../lib/utils/device-info.util';
import {SsmEvents} from '../../lib/utils/eventsNames.util';

@Component({
  selector: 'smartstock-sale',
  template: `
    <mat-sidenav-container class="match-parent">

      <mat-sidenav class="match-parent-side" #sidenav [mode]="'over'" [opened]="false">
        <smartstock-admin-drawer></smartstock-admin-drawer>
      </mat-sidenav>

      <mat-sidenav #cartdrawer [fixedInViewport]="false" position="end" [mode]="enoughWidth()?'side':'over'"
                   [opened]="false">
        <smartstock-cart [isViewedInWholesale]="isViewedInWholesale" [cartdrawer]="cartdrawer"></smartstock-cart>
      </mat-sidenav>

      <mat-sidenav-content style="display:flex; flex-direction: column">

        <smartstock-toolbar (searchCallback)="filterProduct($event)"
                     [showSearch]="true"
                     [hasBackRoute]="true" [backLink]="'/sale/'"
                     searchPlaceholder="Filter product"
                     [searchInputControl]="searchInputControl"
                     [searchProgressFlag]="searchProgressFlag"
                     [heading]="isViewedInWholesale?'WholeSale':'Retail'" [sidenav]="sidenav"
                     [cartdrawer]="cartdrawer"
                     [showProgress]="showProgress"></smartstock-toolbar>

        <smartstock-on-fetch *ngIf="!products || fetchDataProgress" [isLoading]="fetchDataProgress"
                      (refreshCallback)="getProductsFromServer()"></smartstock-on-fetch>

        <cdk-virtual-scroll-viewport style="flex-grow: 1" itemSize="25" *ngIf="products && !fetchDataProgress">
          <smartstock-product-card style="margin: 0 5px; display: inline-block"
                            [cartdrawer]="cartdrawer"
                            [product]="product"
                            [productIndex]="idx"
                            [isViewedInWholesale]="isViewedInWholesale"
                            *cdkVirtualFor="let product of products; let idx = index">
          </smartstock-product-card>
        </cdk-virtual-scroll-viewport>

        <div style="position: fixed; width: 100%;display: flex; flex-direction: row; justify-content: center;
           align-items: center; z-index: 3000; left: 16px; bottom: 20px;">
          <button mat-button color="primary"
                  *ngIf="!fetchDataProgress && products &&showRefreshCart"
                  (click)="getProductsFromServer()"
                  matTooltip="Refresh products from server"
                  class="mat-fab">
            <mat-icon>refresh</mat-icon>
          </button>
          <span [ngStyle]="showRefreshCart?{flex: '1 1 auto'}:{}"></span>
          <smartstock-cart-preview [cartSidenav]="cartdrawer" [isWholeSale]="isViewedInWholesale"></smartstock-cart-preview>
        </div>
      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/sale.style.css'],
  providers: [
    SalesState,
    UserDatabaseService
  ]
})
export class SaleComponent extends DeviceInfoUtil implements OnInit {
  products: StockModel[] = undefined;
  fetchDataProgress = false;
  showProgress = false;
  @ViewChild('sidenav') sidenav: MatSidenav;
  searchProgressFlag = false;
  @Input() isViewedInWholesale = true;
  isMobile = environment.android;
  noOfProductsInCart = 1;
  searchInputControl = new FormControl('');
  showRefreshCart = false;

  constructor(private readonly router: Router,
              private readonly userDatabase: UserDatabaseService,
              private readonly storage: StorageService,
              private readonly snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly eventApi: EventService,
              private readonly salesState: SalesState,
  ) {
    super();
  }

  ngOnInit() {
    this.getProducts();
    this._addToCartEventListener();
    this.eventApi.listen(SsmEvents.NO_OF_CART, data => {
      this.showRefreshCart = data.detail === 0;
    });
  }

  getProductsFromServer() {
    this.fetchDataProgress = true;
    this.salesState.getAllStock().then(products => {
      this.fetchDataProgress = false;
      this.products = products;
    }).catch(reason => {
      this.fetchDataProgress = false;
      this.logger.i(reason);
    });
  }

  getProducts() {
    this.fetchDataProgress = true;
    this.products = undefined;
    this.storage.getStocks().then(products => {
      this.fetchDataProgress = false;
      if (products && products.length > 0) {
        this.products = products;
      }
    }).catch(reason => {
      this.fetchDataProgress = false;
      this.logger.i(reason);
    });
  }

  filterProduct(product: string) {
    product = product.trim();
    this.searchProgressFlag = true;
    if (product === '') {
      this.getProducts();
      this.searchProgressFlag = false;
      return;
    }
    this.storage.getStocks().then(allStocks => {
      this.searchProgressFlag = false;
      if (allStocks) {
        this.products = allStocks.filter(stock => stock.product.toLowerCase().trim().includes(product.trim().toLowerCase()));
      } else {
        this.snack.open('No products found, try again or refresh products', 'Ok', {
          duration: 3000
        });
      }
    }).catch(reason => {
      this.searchProgressFlag = false;
      this.logger.i(reason);
      this.snack.open(reason, 'Ok');
    });
  }

  private _addToCartEventListener() {
    this.eventApi.listen(SsmEvents.ADD_CART, _ => {
      this.searchInputControl.setValue('');
    });
  }
}
