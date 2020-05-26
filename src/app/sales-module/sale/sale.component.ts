import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Stock} from '../../model/stock';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {UserDatabaseService} from '../../services/user-database.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LogService} from '../../services/log.service';
import {StockDatabaseService} from '../../services/stock-database.service';
import {DeviceInfo} from '../../shared-components/DeviceInfo';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent extends DeviceInfo implements OnInit {
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
    product = product.trim();
    this.searchProgressFlag = true;
    if (product === '') {
      this.getProducts();
      this.searchProgressFlag = false;
      return;
    }
    this._storage.getStocks().then(allStocks => {
      this.searchProgressFlag = false;
      if (allStocks) {
        const keywords = product.toLowerCase().split(' ').filter(value => {
          return value !== '';
        });
        console.log(keywords);
        const result = allStocks.filter(stock => {
          const targetSentence =
            `${stock.product}_${stock.supplier}_${stock.retailPrice}_${stock.category}_${stock.wholesalePrice}_${stock.unit}`
              .toLowerCase();
          let flag = false;
          for (const keyword of keywords) {
            const searchResult = targetSentence.includes(keyword);
            if (searchResult === true) {
              flag = true;
            }
          }
          return flag;
        });
        console.log(result);
        this.productsObservable = of(result);
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
