import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
/***** move to common ********/
import {UserDatabaseService} from 'src/app/services/user-database.service';
/***** move to common ********/
import {StorageService} from 'src/app/services/storage.service';
import {MatSidenav} from '@angular/material/sidenav';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, of} from 'rxjs';
/***** move to common ********/
import {LogService} from '../../lib/services/log.service';
/***** move to common ********/
import {StockModel} from '../models/stock.model';
import {SalesState} from '../states/sales.state';
import {DeviceInfoUtil} from '../../lib/utils/device-info.util';

@Component({
  selector: 'app-retail-sale',
  template: `
    <app-sale [isViewedInWholesale]="false"></app-sale>
  `,
  styleUrls: ['../styles/retail.style.css']
})
export class RetailPageComponent extends DeviceInfoUtil implements OnInit {

  productsObservable: Observable<StockModel[]>;
  fetchDataProgress = false;
  showProgress = false;
  @ViewChild('sidenav') sidenav: MatSidenav;
  searchProgressFlag = false;
  @Input() isViewedInWholesale = false;

  constructor(private readonly router: Router,
              private readonly userDatabase: UserDatabaseService,
              private readonly _storage: StorageService,
              private readonly snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly salesState: SalesState,
  ) {
    super();
  }

  ngOnInit() {
    this.getProducts();
  }

  getProductsFromServer() {
    this.fetchDataProgress = true;
    this.productsObservable = undefined;
    this.salesState.getAllStock().then(products => {
      this.fetchDataProgress = false;
      this.productsObservable = of(products);
    }).catch(reason => {
      this.fetchDataProgress = false;
      this.logger.i(reason);
    });
  }

  getProducts() {
    this.fetchDataProgress = true;
    this.productsObservable = undefined;
    this._storage.getStocks().then(products => {
      this.fetchDataProgress = false;
      this.productsObservable = of(products);
    }).catch(reason => {
      this.fetchDataProgress = false;
      this.logger.i(reason);
    });
  }

  filterProduct(product: string) {
    // this.productsObservable.subscribe((data) => {
    //
    // }, (error) => {
    //
    // });
    //
    this.searchProgressFlag = true;
    if (product === '') {
      this.getProducts();
      this.searchProgressFlag = false;
      return;
    }
    this._storage.getStocks().then(value => {
      this.searchProgressFlag = false;
      if (value) {
        const result = value.filter(value1 =>
          (value1.product.toLowerCase().includes(product.toLowerCase()))
        );
        this.productsObservable = of(result.slice(0, result.length > 50 ? 50 : result.length));
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
}
