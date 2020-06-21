import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {SalesDatabaseService} from '../../../services/sales-database.service';
import {StockDatabaseService} from '../../../services/stock-database.service';
import {StorageService} from '../../../services/storage.service';
import {UserDatabaseService} from '../../../services/user-database.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Stock} from '../../../model/stock';
import {LogService} from '../../../services/log.service';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {EventApiService} from '../../../services/event-api.service';
import {environment} from '../../../../environments/environment';
import {FormControl} from '@angular/forms';
import {SsmEvents} from '../../../utils/eventsNames';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
  providers: [
    SalesDatabaseService,
    UserDatabaseService
  ]
})
export class SaleComponent extends DeviceInfo implements OnInit {
  products: Stock[] = undefined;
  fetchDataProgress = false;
  showProgress = false;
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
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
              private readonly eventApi: EventApiService,
              private readonly stockApi: StockDatabaseService,
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
    this.stockApi.getAllStock().then(products => {
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
