import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserDatabaseService } from 'src/app/services/user-database.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { StockDatabaseService } from 'src/app/services/stock-database.service';
import { DeviceInfo } from 'src/app/common-components/DeviceInfo';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-retail-sale',
  templateUrl: './retail-sale.component.html',
  styleUrls: ['./retail-sale.component.css']
})
export class RetailSaleComponent extends DeviceInfo implements OnInit {

  productsObservable;
  fetchDataProgress = false;
  showProgress = false;
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  constructor(private readonly router: Router,
              private readonly userDatabase: UserDatabaseService,
              private readonly _storage: LocalStorageService,
              private readonly _stockApi: StockDatabaseService,
          ) {
    super();
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.fetchDataProgress = true;
    this.productsObservable = undefined;
    this._storage.getStocks().then(products => {
      this.fetchDataProgress = false;
      this.productsObservable = products;
       console.log(products);
    }).catch(reason => {
      this.fetchDataProgress = false;
      console.log(reason);
    });
  }

}
