import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {MatSliderModule} from '@angular/material/slider';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import {bfast} from 'bfastjs';
import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HttpClientModule} from '@angular/common/http';
import {MatNativeDateModule} from '@angular/material/core';
import {HammerModule} from '@angular/platform-browser';
import {AuthenticationGuard} from './guards/authentication.guard';
import {AdminGuard} from './guards/admin.guard';
import {ActiveShopGuard} from './guards/active-shop.guard';
import {ConfigsService, EventService, LibModule, StorageService} from '@smartstocktz/core-libs';
import {ManagerGuard} from './guards/manager.guard';
import {WebGuard} from './guards/web.guard';
import {PaymentGuard} from './guards/payment.guard';
import {PaymentDialogComponent} from './components/payment-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {ServiceWorkerModule} from '@angular/service-worker';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {ReportNavigationService} from '@smartstocktz/reports';
import {SalesNavigationService} from '@smartstocktz/sales';
import {StockNavigationService} from '@smartstocktz/stocks';
import {PurchaseNavigationService} from '@smartstocktz/purchases';
import {ExpenseNavigationService} from '@smartstocktz/expense';
import {AccountsNavigationService} from '@smartstocktz/accounts';
import {StoreNavigationService} from '@smartstocktz/store';
import firebase from 'firebase/app';
import "firebase/analytics";

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
    canActivate: [PaymentGuard, AuthenticationGuard, ActiveShopGuard],
    loadChildren: () => import('@smartstocktz/sales').then(mod => mod.SalesModule)
  },
  {
    path: 'expense',
    canActivate: [PaymentGuard, ManagerGuard, ActiveShopGuard],
    loadChildren: () => import('@smartstocktz/expense').then(mod => mod.ExpenseModule)
  },
  {
    path: 'store',
    canActivate: [PaymentGuard, ManagerGuard, ActiveShopGuard],
    loadChildren: () => import('@smartstocktz/store').then(mod => mod.StoreModule)
  },
  {
    path: 'stock',
    canActivate: [PaymentGuard, AuthenticationGuard, ManagerGuard, ActiveShopGuard],
    loadChildren: async () => {
      const shop: any = await new StorageService(new EventService()).getActiveShop();
      if (shop && shop.settings && shop.settings.module && shop.settings.module.stock) {
        switch (shop.settings.module.stock.toString().trim()) {
          case '@smartstocktz/stocks':
            return import('@smartstocktz/stocks').then(mod => mod.StocksModule);
          case '@smartstocktz/stocks-real-estate':
            return import('@smartstocktz/stocks-real-estate').then(mod => mod.StocksModule);
          default:
            return import('@smartstocktz/stocks').then(mod => mod.StocksModule);
        }
      } else {
        return import('@smartstocktz/stocks').then(mod => mod.StocksModule);
      }
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
    environment.desktop ? LibModule : ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
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
    MatBottomSheetModule
  ],
  bootstrap: [AppComponent]
})
export class SmartstockModule {
  constructor(private readonly config: ConfigsService,
              private readonly salesNav: SalesNavigationService,
              private readonly reportNav: ReportNavigationService,
              private readonly stockNav: StockNavigationService,
              private readonly purchaseNav: PurchaseNavigationService,
              private readonly expenseNav: ExpenseNavigationService,
              private readonly storeNav: StoreNavigationService,
              private readonly accountNav: AccountsNavigationService) {
    firebase.initializeApp(environment.firebase);
    firebase.analytics();
    // @ts-ignore
    import('../../package.json').then(pkg => {
      this.config.versionName = pkg.version;
      this.config.production = true;
    });
    bfast.init({
      applicationId: environment.smartstock.applicationId,
      projectId: environment.smartstock.projectId,
      appPassword: environment.smartstock.pass
    });
    bfast.init({
      applicationId: environment.fahamupay.applicationId,
      projectId: environment.fahamupay.projectId,
      appPassword: environment.fahamupay.pass
    }, environment.fahamupay.projectId);

    [
      {
        name: 'Dashboard',
        link: '/dashboard',
        roles: ['admin'],
        icon: 'dashboard',
        pages: []
      },
      {
        name: 'Report',
        link: '/report',
        roles: ['admin'],
        icon: 'table_chart',
        pages: []
      },
      {
        name: 'Sale',
        link: '/sale',
        roles: ['*'],
        icon: 'shop_front',
        pages: []
      },
      {
        name: 'Purchase',
        link: '/purchase',
        roles: ['manager', 'admin'],
        icon: 'receipt',
        pages: []
      },
      {
        name: 'Stock',
        link: '/stock',
        roles: ['manager', 'admin'],
        icon: 'store',
        pages: []
      },
      {
        name: 'Store',
        link: '/store',
        roles: ['manager', 'admin'],
        icon: 'widgets',
        pages: []
      },
      {
        name: 'Expense',
        link: '/expense',
        roles: ['manager', 'admin'],
        icon: 'receipt',
        pages: []
      },
      {
        name: 'Account',
        link: '/account',
        roles: ['*'],
        icon: 'supervisor_account',
        pages: []
      },
    ].forEach(menu => {
      this.config.addMenu(menu);
    });
    this.reportNav.init();
    this.salesNav.init();
    this.stockNav.init();
    this.purchaseNav.init();
    this.storeNav.init();
    this.expenseNav.init();
    this.accountNav.init();
    config.selectedModuleName = '';
  }
}
