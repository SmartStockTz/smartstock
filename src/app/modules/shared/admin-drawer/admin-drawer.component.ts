import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {EventApiService} from '../../../services/event-api.service';
import {ShopI} from '../../../model/ShopI';
import {UserDatabaseService} from '../../../services/user-database.service';
import {UserI} from '../../../model/UserI';
import {SsmEvents} from '../../../utils/eventsNames';
import {LogService} from '../../../services/log.service';

@Component({
  selector: 'app-admin-drawer',
  templateUrl: './admin-drawer.component.html',
  styleUrls: ['./admin-drawer.component.css']
})
export class AdminDrawerComponent implements OnInit {

  constructor(private readonly _userApi: UserDatabaseService,
              private readonly logger: LogService,
              private readonly eventApi: EventApiService) {
  }

  shop: ShopI;
  currentUser: UserI;

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
  versionNumber: Observable<string> = of();

  ngOnInit() {
    // @ts-ignore
    import('../../../../../package.json').then(pkg => {
      this.versionNumber = of(pkg.version);
    });

    this._userApi.getCurrentShop().then(shop => {
      this.shop = shop;
    }).catch(reason => {
      console.log(reason);
      this.shop = undefined;
    });
    this._userApi.currentUser().then(user => {
      this.currentUser = user;
    });
    this.eventApi.listen(SsmEvents.SETTINGS_UPDATED, data => {
      this._userApi.getCurrentShop().then(shop => {
        this.shop = shop;
      }).catch(reason => {
        this.logger.e(reason, 'AdminDrawerComponent:37');
        this.shop = undefined;
      });
    });
  }

  shouldExpand(route: string) {
    const url = new URL(location.href);
    return url.pathname.startsWith('/' + route);
  }
}
