import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {CreateShopComponent} from './create-shop/create-shop.component';
import {Observable} from 'rxjs';
import {ShopI} from '../model/ShopI';
import {UserDatabaseService} from '../services/user-database.service';

@Component({
  selector: 'app-choose-shop',
  templateUrl: './choose-shop.component.html',
  styleUrls: ['./choose-shop.component.css']
})
export class ChooseShopComponent implements OnInit {

  constructor(public createShopDialog: MatDialog,
              private readonly userDatabase: UserDatabaseService) {
  }

  shopDetails = {};
  shops: Observable<ShopI[]>;

  openCreateShopDialog() {
    const dialogRef = this.createShopDialog.open(CreateShopComponent, {
      // width: '400px',
      data: this.shopDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
    this.userDatabase.currentUser()
  }

}
