import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {MatSliderModule} from '@angular/material/slider';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ServiceWorkerModule} from '@angular/service-worker';
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
import {LibModule} from '@smartstocktz/core-libs';
import {ManagerGuard} from './guards/manager.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/web/web.module').then(mod => mod.WebModule),
  },
  {
    path: 'dashboard',
    canActivate: [AdminGuard, ActiveShopGuard],
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(mod => mod.DashboardModule)
  },
  {
    path: 'report',
    canActivate: [AdminGuard, ActiveShopGuard],
    loadChildren: () => import('./modules/reports/reports.module').then(mod => mod.ReportsModule)
  },
  {
    path: 'sale',
    canActivate: [AuthenticationGuard, ActiveShopGuard],
    loadChildren: () => import('@smartstocktz/sales').then(mod => mod.SalesModule)
  },
  {
    path: 'stock',
    canActivate: [ManagerGuard, ActiveShopGuard],
    loadChildren: () => import('@smartstocktz/stocks').then(mod => mod.StockModule)
  },
  {
    path: 'purchase',
    canActivate: [ManagerGuard, ActiveShopGuard],
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
  // {
  //   path: '**', loadChildren: () => import('./modules/web/web.module').then(mod => mod.WebModule)
  // }
];

@NgModule({
  declarations: [
    AppComponent
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // @ts-ignore
    import('../../package.json').then(pkg => {
      LibModule.start({
        version: pkg.version
      });
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
  }
}
