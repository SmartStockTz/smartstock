import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {MatSliderModule} from '@angular/material/slider';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BFast} from 'bfastjs';
import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HttpClientModule} from '@angular/common/http';
import {MatNativeDateModule} from '@angular/material/core';
import {HammerModule} from '@angular/platform-browser';
import {AuthenticationGuard} from './guards/authentication.guard';
import {AdminGuard} from './guards/admin.guard';
import {ActiveShopGuard} from './guards/active-shop.guard';
import {ConfigsService, LibModule} from '@smartstocktz/core-libs';
import {ManagerGuard} from './guards/manager.guard';
import {WebGuard} from './guards/web.guard';
import firebase from 'firebase';
import {PaymentGuard} from './guards/payment.guard';
import {PaymentDialogComponent} from './components/payment-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {ServiceWorkerModule} from '@angular/service-worker';

const routes: Routes = [
  {
    path: '',
    canActivate: [WebGuard],
    loadChildren: () => {
      return import('@smartstocktz/web').then(mod => mod.WebModule);
    },
  },
  {
    path: 'dashboard',
    canActivate: [PaymentGuard, AuthenticationGuard, AdminGuard, ActiveShopGuard],
    loadChildren: () => import('@smartstocktz/dashboard').then(mod => mod.DashboardModule)
  },
  {
    path: 'report',
    canActivate: [PaymentGuard, AuthenticationGuard, AdminGuard, ActiveShopGuard],
    loadChildren: () => import('@smartstocktz/reports').then(mod => mod.ReportsModule)
  },
  {
    path: 'sale',
    canActivate: [PaymentGuard, AuthenticationGuard, AuthenticationGuard, ActiveShopGuard],
    loadChildren: () => import('@smartstocktz/sales').then(mod => mod.SalesModule)
  },
  {
    path: 'stock',
    canActivate: [PaymentGuard, AuthenticationGuard, ManagerGuard, ActiveShopGuard],
    loadChildren: () => {
      return import('@smartstocktz/stocks').then(mod => mod.StocksModule);
    }
  },
  {
    path: 'purchase',
    canActivate: [PaymentGuard, AuthenticationGuard, ManagerGuard, ActiveShopGuard],
    loadChildren: () => import('@smartstocktz/purchases').then(mod => mod.PurchasesModule)
  },
  {
    path: 'account',
    loadChildren: () => import('@smartstocktz/accounts').then(mod => mod.AccountModule)
  },
  {
    path: 'home',
    redirectTo: 'dashboard'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    PaymentDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    LibModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    MatStepperModule,
    HttpClientModule,
    MatTooltipModule,
    MatSliderModule,
    MatSnackBarModule,
    RouterModule,
    MatNativeDateModule,
    HammerModule,
    MatDialogModule,
    MatButtonModule,
  ],
  bootstrap: [AppComponent]
})
export class SmartstockModule {
  constructor(private readonly config: ConfigsService) {
    firebase.initializeApp(environment.firebase);
    firebase.analytics();
    // @ts-ignore
    import('../../package.json').then(pkg => {
      this.config.versionName = pkg.version;
      config.production = true;
    });
    BFast.init({
      applicationId: environment.smartstock.applicationId,
      projectId: environment.smartstock.projectId,
      appPassword: environment.smartstock.pass
    });
    BFast.init({
      applicationId: environment.fahamupay.applicationId,
      projectId: environment.fahamupay.projectId,
      appPassword: environment.fahamupay.pass
    }, environment.fahamupay.projectId);

    this.config.menu = [
      {
        name: 'Dashboard',
        link: '/dashboard',
        roles: ['admin'],
        icon: 'dashboard',
      },
      {
        name: 'Report',
        link: '/report',
        roles: ['admin'],
        icon: 'table_chart',
        pages: [
          {
            link: '/report/sales/overview',
            name: 'Sales Overviews',
            roles: ['admin']
          },
          {
            link: '/report/sales/performance',
            name: 'Sales Performance',
            roles: ['admin']
          },
          {
            link: '/report/sales/tracking',
            name: 'Sales Tracking',
            roles: ['*']
          },
          {
            link: '/report/sales/growth',
            name: 'Sales Growth',
            roles: ['*']
          },
          {
            link: '/report/stock/overview',
            name: 'Stocks Overviews',
            roles: ['admin', 'manager']
          }
        ]
      },
      {
        name: 'Sale',
        link: '/sale',
        roles: ['*'],
        icon: 'shop_front',
        pages: [
          {
            name: 'Retail',
            link: '/sale/retail',
            roles: ['*']
          },
          {
            name: 'Wholesale',
            link: '/sale/whole',
            roles: ['*']
          },
          {
            name: 'Orders',
            link: '/sale/order',
            roles: ['*']
          },
          {
            name: 'Credit Sale',
            link: '/sale/pay_by_credit',
            roles: ['*']
          }
        ]
      },
      {
        name: 'Purchase',
        link: '/purchase',
        roles: ['manager', 'admin'],
        icon: 'receipt',
      },
      {
        name: 'Stock',
        link: '/stock',
        roles: ['manager', 'admin'],
        icon: 'store',
        pages: [
          {
            name: 'Products',
            link: '/stock/products',
            roles: ['admin', 'manager']
          },
          {
            name: 'Categories',
            link: '/stock/categories',
            roles: ['admin', 'manager']
          },
          {
            name: 'Catalogs',
            link: '/stock/catalogs',
            roles: ['admin', 'manager']
          },
          {
            name: 'Suppliers',
            link: '/stock/suppliers',
            roles: ['admin', 'manager']
          },
          {
            name: 'Units',
            link: '/stock/units',
            roles: ['admin', 'manager']
          },
          {
            name: 'Transfers',
            link: '/stock/transfers',
            roles: ['admin', 'manager']
          }
        ]
      },
      {
        name: 'Account',
        link: '/account',
        roles: ['*'],
        icon: 'supervisor_account',
        pages: [
          {
            name: 'Profile',
            link: '/account/profile',
            roles: ['*']
          },
          {
            name: 'Users',
            link: '/account/users',
            roles: ['admin', 'manager']
          },
          {
            name: 'Shops',
            link: '/account/shops',
            roles: ['admin', 'manager']
          },
          {
            name: 'Payments',
            link: '/account/bill',
            roles: ['*']
          }
        ]
      },
    ];
  }
}
