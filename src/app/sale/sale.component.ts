import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Urls} from '../database/urls';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  product = new FormControl();
  filteredOptions: Observable<Stock[]>;

  constructor(private router: Router, private http: HttpClient) {
  }

  ngOnInit() {
    // this.filteredOptions = this.product.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value))
    //   );
    // this.getProduct();
    this.product.valueChanges.subscribe(value => {
      console.log('value typed is ' + value.toString());
      this.getProduct(value.toString());
    }, error1 => {
      console.log(error1);
    });
  }

  private getProduct(p: string): void {
    this.http.get(Urls.SEARCH_PRODUCT + p).pipe(
      map(value => {
        let json: any;
        json = JSON.stringify(value);
        json = JSON.parse(json);
        const st = json._embedded.stock;
        console.log(st);
        this.filteredOptions = st;
      })
    );
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
