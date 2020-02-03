import {Component, OnInit} from '@angular/core';
import {ShopI} from '../../model/ShopI';
import {UserDatabaseService} from '../../services/user-database.service';

@Component({
  selector: 'app-admin-drawer',
  templateUrl: './admin-drawer.component.html',
  styleUrls: ['./admin-drawer.component.css']
})
export class AdminDrawerComponent implements OnInit {
  shop: ShopI;

  constructor(
    private readonly _userApi: UserDatabaseService) {
  }

  ngOnInit() {
    this._userApi.getCurrentShop().then(shop => {
      this.shop = shop;
    }).catch(reason => {
      console.log(reason);
      this.shop = undefined;
    });
  }

  shouldExpand(route: string) {
    const url = new URL(location.href);
    return url.pathname.startsWith('/' + route);
  }
}
