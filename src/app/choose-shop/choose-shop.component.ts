import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CreateShopComponent} from './create-shop/create-shop.component';
import {Observable, of} from 'rxjs';
import {ShopI} from '../model/ShopI';
import {UserDatabaseService} from '../services/user-database.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-choose-shop',
  templateUrl: './choose-shop.component.html',
  styleUrls: ['./choose-shop.component.css']
})
export class ChooseShopComponent implements OnInit {

  shopDetails = {};
  shops: Observable<ShopI[]>;

  constructor(public createShopDialog: MatDialog,
              private readonly _snack: MatSnackBar,
              private readonly _router: Router,
              private readonly userDatabase: UserDatabaseService) {
  }

  openCreateShopDialog() {
    const dialogRef = this.createShopDialog.open(CreateShopComponent, {
      minWidth: 350,
      // maxWidth: 400,
      data: this.shopDetails,
      disableClose: true,
      closeOnNavigation: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
    this.userDatabase.getShops().then(shops => {
      this.shops = of(shops);
    }).catch(reason => {
      console.log(reason);
      this._snack.open('Error when fetch available shops', 'Ok', {
        duration: 3000
      });
    });
  }

  setCurrentProject(shop: ShopI) {
    this._snack.open('We prepare your shop...', 'Ok', {
      duration: 1000
    });
    this.userDatabase.saveCurrentShop(shop).then(_ => {
      this._router.navigateByUrl('/dashboard').catch(reason => console.log(reason));
    }).catch(reason => {
      console.log(reason);
      this._snack.open('Error when trying to save your current shop', 'Ok', {
        duration: 3000
      });
    });
  }
}
