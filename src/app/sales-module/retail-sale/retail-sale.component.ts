import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {UserDatabaseService} from 'src/app/services/user-database.service';
import {LocalStorageService} from 'src/app/services/local-storage.service';
import {StockDatabaseService} from 'src/app/services/stock-database.service';
import {DeviceInfo} from 'src/app/shared-components/DeviceInfo';
import {MatSidenav} from '@angular/material/sidenav';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, of} from 'rxjs';
import {Stock} from '../../model/stock';
import {LogService} from '../../services/log.service';

@Component({
  selector: 'app-retail-sale',
  templateUrl: './retail-sale.component.html',
  styleUrls: ['./retail-sale.component.css']
})
export class RetailSaleComponent extends DeviceInfo implements OnInit {

  productsObservable: Observable<Stock[]>;
  fetchDataProgress = false;
  showProgress = false;
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
  searchProgressFlag = false;
  @Input() isViewedInWholesale = false;

  constructor(private readonly router: Router,
              private readonly userDatabase: UserDatabaseService,
              private readonly _storage: LocalStorageService,
              private readonly snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly _stockApi: StockDatabaseService,
  ) {
    super();
  }

  ngOnInit() {
    this.getProducts();
  }

  getProductsFromServer() {
    this.fetchDataProgress = true;
    this.productsObservable = undefined;
    this._stockApi.getAllStock().then(products => {
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
