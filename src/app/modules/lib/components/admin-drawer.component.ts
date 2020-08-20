import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {EventApiService} from '../services/event-api.service';
import {UserDatabaseService} from '../../../services/user-database.service';
import {UserI} from '../../../model/UserI';
import {LogService} from '../services/log.service';
import {SsmEvents} from '../utils/eventsNames.util';
import {ShopModel} from '../models/shop.model';

@Component({
  selector: 'app-admin-drawer',
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
                  routerLink="/shop" mat-button>
            Change Shop
          </button>
        </div>

        <div class="d-flex justify-content-center align-items-center">
          <mat-divider></mat-divider>
        </div>

        <mat-accordion [multi]="true" class="mat-elevation-z0">
          <mat-nav-list *ngIf="currentUser && (currentUser.role==='admin')" class="mat-elevation-z0">
            <mat-list-item routerLink="/dashboard">
              <mat-icon matListIcon matPrefix color="primary">dashboard</mat-icon>
              <span matLine style="margin-left: 8px">Dashboard</span>
            </mat-list-item>
          </mat-nav-list>

          <mat-divider *ngIf="currentUser && currentUser.role==='admin'"></mat-divider>

          <mat-expansion-panel *ngIf="currentUser && (currentUser.role==='admin')"
                               [expanded]="shouldExpand('report')"
                               class="mat-elevation-z0">
            <mat-expansion-panel-header>
              <mat-icon matPrefix color="primary">table_chart</mat-icon>
              <span style="margin-left: 8px">Reports</span>
            </mat-expansion-panel-header>
            <mat-nav-list>
              <a mat-list-item routerLink="/report/sales">Sales Reports</a>
              <a mat-list-item routerLink="/report/stocks">StockModel Reports</a>
            </mat-nav-list>
          </mat-expansion-panel>

          <mat-divider *ngIf="currentUser && currentUser.role==='admin'"></mat-divider>

          <mat-expansion-panel [expanded]="shouldExpand('sale')" class="mat-elevation-z0">
            <mat-expansion-panel-header>
              <mat-icon matPrefix color="primary">shop_front</mat-icon>
              <span style="margin-left: 8px">Sale</span>
            </mat-expansion-panel-header>
            <mat-nav-list>
              <a *ngIf="shop && (shop.settings.allowRetail===undefined?true:shop.settings.allowRetail)" mat-list-item
                 routerLink="/sale/retail">Retails</a>
              <a *ngIf="shop && (shop.settings.allowWholesale===undefined?true:shop.settings.allowWholesale)" mat-list-item
                 routerLink="/sale/whole">WholeSale</a>
              <!--          <a mat-list-item routerLink="/sale">Quick Reports</a>-->
            </mat-nav-list>
          </mat-expansion-panel>

          <mat-divider></mat-divider>

          <mat-expansion-panel *ngIf="currentUser && (currentUser.role==='admin' || currentUser.role === 'manager')"
                               [expanded]="shouldExpand('purchase')" class="mat-elevation-z0">
            <mat-expansion-panel-header>
              <mat-icon matPrefix color="primary">receipts</mat-icon>
              <span style="margin-left: 8px">Purchase</span>
            </mat-expansion-panel-header>
            <mat-nav-list>
              <a mat-list-item routerLink="/purchase">All Purchases</a>
              <a mat-list-item routerLink="/purchase/create">New Purchase</a>
              <a mat-list-item routerLink="/stock" [queryParams]="{t:3}">Suppliers</a>
            </mat-nav-list>
          </mat-expansion-panel>

          <mat-divider *ngIf="currentUser && (currentUser.role==='admin' || currentUser.role === 'manager')"></mat-divider>

          <mat-expansion-panel *ngIf="currentUser && (currentUser.role==='admin' || currentUser.role === 'manager')"
                               [expanded]="shouldExpand('stock')" class="mat-elevation-z0">
            <mat-expansion-panel-header>
              <mat-icon matPrefix color="primary">store</mat-icon>
              <span style="margin-left: 8px">StockModel</span>
            </mat-expansion-panel-header>
            <mat-nav-list>
              <a mat-list-item routerLink="/stock" [queryParams]="{t:'0'}">Products</a>
              <a mat-list-item routerLink="/stock" [queryParams]="{t:'1'}">Categories</a>
              <a mat-list-item routerLink="/stock" [queryParams]="{t:'2'}">Units</a>
              <a mat-list-item routerLink="/stock" [queryParams]="{t:'3'}">Suppliers</a>
            </mat-nav-list>
          </mat-expansion-panel>

          <mat-divider *ngIf="currentUser && (currentUser.role==='admin' || currentUser.role === 'manager')"></mat-divider>

          <mat-expansion-panel [expanded]="shouldExpand('settings')"
                               class="mat-elevation-z0">
            <mat-expansion-panel-header>
              <mat-icon matPrefix color="primary">supervisor_account</mat-icon>
              <span style="margin-left: 8px">Account</span>
            </mat-expansion-panel-header>
            <mat-nav-list>
              <a *ngIf="currentUser && (currentUser.role==='admin' || currentUser.role==='manager')" mat-list-item
                 routerLink="/settings/general">
                <div class="d-flex flex-row flex-nowrap btn-block">
                  <span>Settings</span>
                  <span class="flex-grow-1"></span>
                  <mat-icon color="primary">settings</mat-icon>
                </div>
              </a>
              <a *ngIf="currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager')" mat-list-item
                 routerLink="/settings/bill">
                <div class="d-flex flex-row flex-nowrap btn-block">
                  <span>Billing</span>
                  <span class="flex-grow-1"></span>
                  <mat-icon color="primary">payment</mat-icon>
                </div>
              </a>
              <a *ngIf="currentUser && ( currentUser.role==='admin' || currentUser.role==='manager')" mat-list-item
                 routerLink="/settings/users">
                <div class="d-flex flex-row flex-nowrap btn-block">
                  <span>Users</span>
                  <span class="flex-grow-1"></span>
                  <mat-icon color="primary">person_add</mat-icon>
                </div>
              </a>
              <a mat-list-item routerLink="/settings/profile">
                <div class="d-flex flex-row flex-nowrap btn-block">
                  <span>Profile</span>
                  <span class="flex-grow-1"></span>
                  <mat-icon color="primary">person</mat-icon>
                </div>
              </a>
            </mat-nav-list>
          </mat-expansion-panel>
        </mat-accordion>

      </div>
      <span style="flex-grow: 1"></span>
      <div style="display: flex; justify-content: center; align-items: center">
        <span>Ver: {{versionNumber | async}}</span>
      </div>
    </div>
  `,
  styleUrls: ['../styles/admin-drawer.style.css']
})
export class AdminDrawerComponent implements OnInit {

  constructor(private readonly _userApi: UserDatabaseService,
              private readonly logger: LogService,
              private readonly eventApi: EventApiService) {
  }

  shop: ShopModel;
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
