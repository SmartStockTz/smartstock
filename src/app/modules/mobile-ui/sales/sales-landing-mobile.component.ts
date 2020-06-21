import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {ShopI} from '../../../model/ShopI';
import {UserDatabaseService} from '../../../services/user-database.service';

@Component({
  selector: 'app-sales-landing',
  templateUrl: './sales-landing-mobile.component.html',
  styleUrls: ['./sales-landing-mobile.component.css']
})
export class SalesLandingMobileComponent extends DeviceInfo implements OnInit {
  shop: ShopI;

  constructor(private readonly userApi: UserDatabaseService) {
    super();
  }

  ngOnInit(): void {
    this.userApi.getCurrentShop().then(shop => {
      this.shop = shop;
    }).catch(_ => {
      this.shop = undefined;
    });
  }

}
