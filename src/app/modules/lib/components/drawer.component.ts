import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {EventService} from '../services/event.service';
import {UserService} from '../../account/services/user.service';
import {UserModel} from '../../account/models/user.model';
import {LogService} from '../services/log.service';
import {SsmEvents} from '../utils/eventsNames.util';
import {ShopModel} from '../models/shop.model';

@Component({
  selector: 'smartstock-drawer',
  template: `
    <div class="my-side-nav">
      <div>
        <div class="d-flex justify-content-center align-items-center flex-column" style="padding-bottom: 8px">
          <div style="padding: 16px; justify-content: center; align-items: center">
            <mat-icon style="width: 70px; height: 70px; font-size: 70px" color="primary">store</mat-icon>
          </div>
          <span style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;"
                *ngIf="shop">{{shop.businessName}}</span>
          <span style="width: 4px; height: 4px"></span>
          <button style="width: 80%"
                  color="primary"
                  class="btn-block"
                  routerLink="/account/shop" mat-button>
            Change Shop
          </button>
        </div>

        <div class="d-flex justify-content-center align-items-center">
          <mat-divider></mat-divider>
        </div>

        <mat-accordion [multi]="true" class="mat-elevation-z0">
          <mat-nav-list *ngIf="currentUser && (currentUser.role==='admin')" class="mat-elevation-z0">
            <mat-list-item [ngStyle]="shouldExpand('dashboard')?selectedMenu:{}" routerLink="/dashboard">
              <mat-icon matListIcon matPrefix>dashboard</mat-icon>
              <span matLine style="margin-left: 8px">Dashboard</span>
            </mat-list-item>
          </mat-nav-list>

          <mat-divider *ngIf="currentUser && currentUser.role==='admin'"></mat-divider>

          <mat-expansion-panel *ngIf="currentUser && (currentUser.role==='admin')"
                               [expanded]="shouldExpand('report')"
                               class="mat-elevation-z0">
            <mat-expansion-panel-header>
              <mat-icon matPrefix>table_chart</mat-icon>
              <span style="margin-left: 8px">Reports</span>
            </mat-expansion-panel-header>
            <mat-nav-list>
              <a mat-list-item routerLink="/report/sales">Sales Reports</a>
              <a mat-list-item routerLink="/report/stocks">Stock Reports</a>
            </mat-nav-list>
          </mat-expansion-panel>

          <mat-divider *ngIf="currentUser && currentUser.role==='admin'"></mat-divider>

          <mat-nav-list>
            <mat-list-item [ngStyle]="shouldExpand('sale')?selectedMenu:{}" routerLink="/sale">
              <mat-icon matListIcon matPrefix>shop_front</mat-icon>
              <span matLine style="margin-left: 8px">Sale</span>
            </mat-list-item>
          </mat-nav-list>

          <mat-divider></mat-divider>

          <mat-expansion-panel *ngIf="currentUser && (currentUser.role==='admin' || currentUser.role === 'manager')"
                               [expanded]="shouldExpand('purchase')" class="mat-elevation-z0">
            <mat-expansion-panel-header>
              <mat-icon matPrefix>receipts</mat-icon>
              <span style="margin-left: 8px">Purchase</span>
            </mat-expansion-panel-header>
            <mat-nav-list>
              <a mat-list-item routerLink="/purchase">All Purchases</a>
              <a mat-list-item routerLink="/purchase/create">New Purchase</a>
              <a mat-list-item routerLink="/stock" [queryParams]="{t:3}">Suppliers</a>
            </mat-nav-list>
          </mat-expansion-panel>

          <mat-divider *ngIf="currentUser && (currentUser.role==='admin' || currentUser.role === 'manager')"></mat-divider>

          <mat-nav-list>
            <mat-list-item [ngStyle]="shouldExpand('stock')?selectedMenu:{}" routerLink="/stock">
              <mat-icon matListIcon matPrefix>store</mat-icon>
              <span matLine style="margin-left: 8px">Stock</span>
            </mat-list-item>
          </mat-nav-list>

          <mat-divider *ngIf="currentUser && (currentUser.role==='admin' || currentUser.role === 'manager')"></mat-divider>

          <mat-expansion-panel [expanded]="shouldExpand('settings')"
                               class="mat-elevation-z0">
            <mat-expansion-panel-header>
              <mat-icon matPrefix>supervisor_account</mat-icon>
              <span style="margin-left: 8px">Account</span>
            </mat-expansion-panel-header>
            <mat-nav-list>
              <a *ngIf="currentUser && (currentUser.role==='admin' || currentUser.role==='manager')" mat-list-item
                 routerLink="/account/settings">
                <div class="d-flex flex-row flex-nowrap btn-block">
                  <span>Settings</span>
                  <span class="flex-grow-1"></span>
                  <mat-icon>settings</mat-icon>
                </div>
              </a>
              <a *ngIf="currentUser && ( currentUser.role==='admin' || currentUser.role==='manager')" mat-list-item
                 routerLink="/account/users">
                <div class="d-flex flex-row flex-nowrap btn-block">
                  <span>Users</span>
                  <span class="flex-grow-1"></span>
                  <mat-icon>person_add</mat-icon>
                </div>
              </a>
              <a mat-list-item routerLink="/account/profile">
                <div class="d-flex flex-row flex-nowrap btn-block">
                  <span>Profile</span>
                  <span class="flex-grow-1"></span>
                  <mat-icon>person</mat-icon>
                </div>
              </a>
            </mat-nav-list>
          </mat-expansion-panel>
        </mat-accordion>

      </div>
      <span style="flex-grow: 1"></span>
      <div style="display: flex; justify-content: center; align-items: center">
        <span>Version: {{versionNumber | async}}</span>
      </div>
    </div>
  `,
  styleUrls: ['../styles/admin-drawer.style.css']
})
export class DrawerComponent implements OnInit {

  constructor(private readonly _userApi: UserService,
              private readonly logger: LogService,
              private readonly eventApi: EventService) {
  }

  shop: ShopModel;
  currentUser: UserModel;

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
  selectedMenu = {
    background: '#1b5e20',
    borderTopRightRadius: '50px',
    borderBottomRightRadius: '50px',
    color: 'white'
  };

  ngOnInit() {
    // @ts-ignore
    import('../../../../../package.json').then(pkg => {
      this.versionNumber = of(pkg.version);
    });

    this._userApi.getCurrentShop().then(shop => {
      this.shop = shop;
    }).catch(reason => {
      this.logger.i(reason);
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
