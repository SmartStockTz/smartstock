import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {UrlsConstants} from '../model/urlsConstants';
import {Stock} from '../model/stock';
import {map} from 'rxjs/operators';
import {NgForage} from 'ngforage';
import {UserI} from '../model/UserI';
import {UserDatabaseService} from '../services/user-database.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  isAdmin = false;
  isLogin = false;
  totalPrice = 0;
  priceUnit = 0;
  changePrice = 0;
  @ViewChild('sidenav') sidenav: MatSidenav;
  productNameControlInput = new FormControl();
  receiveControlInput = new FormControl();
  quantityControlInput = new FormControl();
  discountControlInput = new FormControl();
  filteredOptions: Observable<Stock[]>;
  stocks: Stock[];
  stock: Stock;

  constructor(private router: Router,
              private userDatabase: UserDatabaseService,
              private indexDb: NgForage,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.indexDb.getItem<UserI>('user').then(value => {
      if (value === null) {
        this.isLogin = false;
        this.router.navigateByUrl('login').catch(reason => console.log(reason));
      } else {
        this.isAdmin = value.role === 'admin';
        this.isLogin = true;
      }
    }).catch(reason => {
      console.log(reason);
    });

    // control input initialize
    this.initializeView();
  }

  private getProduct(p: string) {
    this.filteredOptions = this.http.get(UrlsConstants.SEARCH_PRODUCT + p)
      .pipe<Stock[]>(
        map(value => this.toJs(value))
      );
  }

  toJs(sourc): Stock[] {
    let json: any;
    json = JSON.stringify(sourc);
    json = JSON.parse(json);
    this.stocks = json._embedded.stock;
    return this.stocks;
  }

  openDrawer() {
    this.sidenav.open()
      .then(value => {
        console.log(value);
      }).catch(reason => {
      console.log(reason.toString());
    });
  }

  home() {
    this.router.navigateByUrl('').catch(reason => {
      console.log(reason.toString());
    });
  }

  logout() {
    this.userDatabase.logout().then(value => {
      this.router.navigateByUrl('').catch(reason => console.log(reason));
    }).catch(reason => {
      console.log(reason);
    });
  }

  addToCart() {

  }

  private initializeView() {
    this.productNameControlInput.valueChanges.subscribe(value => {

    }, error1 => {

    });
  }
}
