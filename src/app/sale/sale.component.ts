import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Urls} from '../database/urls';
import {Stock} from '../database/stock';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  product = new FormControl();
  iQuantity = new FormControl();
  filteredOptions: Observable<Stock[]>;
  stocks: Stock[];
  stock: Stock = {
    product: '',
    sell: 0,
    shelf: 'Shelf',
    category: 'Category',
    profit: 0,
    purchase: 0,
    qStatus: '',
    quantity: 0,
    reorder: 0,
    supplier: '',
    times: 0,
    unit: '',
    wquantity: 0,
    wsell: 0,
  };

  constructor(private router: Router, private http: HttpClient) {
  }

  ngOnInit() {
    this.iQuantity.setValue(1);
    this.product.valueChanges.subscribe(value => {
      this.getProduct(value.toString());
    }, error1 => {
      console.log(error1);
    });
  }

  private getProduct(p: string) {
    this.filteredOptions = this.http.get(Urls.SEARCH_PRODUCT + p)
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
    console.log('side nav about to open');
    this.sidenav.open()
      .then(value => {
        console.log(value);
      }).catch(reason => {
      console.log(reason.toString());
    });
  }

  showProfile() {
    console.log('to go to profile');
  }

  home() {
    this.router.navigateByUrl('/').catch(reason => {
      console.log(reason.toString());
    });
  }

  logout() {
    this.router.navigateByUrl('login').catch(reason => {
      console.log(reason.toString());
    });
  }
}
