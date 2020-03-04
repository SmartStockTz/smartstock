import {Component, OnInit} from '@angular/core';
import {ShopI} from '../../model/ShopI';
import {UserDatabaseService} from '../../services/user-database.service';
import {UserI} from '../../model/UserI';

@Component({
  selector: 'app-admin-drawer',
  templateUrl: './admin-drawer.component.html',
  styleUrls: ['./admin-drawer.component.css']
})
export class AdminDrawerComponent implements OnInit {
  shop: ShopI;
  currentUser: UserI;

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
    this._userApi.currentUser().then(user => {
      this.currentUser = user;
    });
  }

  shouldExpand(route: string) {
    const url = new URL(location.href);
    return url.pathname.startsWith('/' + route);
  }

  // async shouldShow(menuName: string): Promise<boolean> {
  //   try {
  //     // const user = await this._userApi.currentUser();
  //     // switch (menuName) {
  //     //   case 'dashboard':
  //     //     return user.role === 'admin';
  //     //   case 'sale':
  //     //     return (user.role === 'admin' || user.role === 'manager' || user.role === 'user');
  //     //   case 'purchase':
  //     //     return (user.role === 'admin' || user.role === 'manager');
  //     //   case 'stock':
  //     //     return (user.role === 'admin' || user.role === 'manager');
  //     //   case 'settings':
  //     //     return user.role === 'admin';
  //     // }
  //     return true;
  //   } catch (e) {
  //     console.log(e);
  //     return false;
  //   }
  // }
}
