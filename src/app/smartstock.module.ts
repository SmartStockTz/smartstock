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
import {WebGuard} from './guards/web.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [WebGuard],
    loadChildren: () => import('@smartstocktz/web').then(mod => mod.WebModule),
  },
  {
    path: 'dashboard',
    canActivate: [AuthenticationGuard, AdminGuard, ActiveShopGuard],
    loadChildren: () => import('@smartstocktz/dashboard').then(mod => mod.DashboardModule)
  },
  {
    path: 'report',
    canActivate: [AuthenticationGuard, AdminGuard, ActiveShopGuard],
    loadChildren: () => import('@smartstocktz/reports').then(mod => mod.ReportsModule)
  },
  {
    path: 'sale',
    canActivate: [AuthenticationGuard, AuthenticationGuard, ActiveShopGuard],
    loadChildren: () => import('@smartstocktz/sales').then(mod => mod.SalesModule)
  },
  {
    path: 'stock',
    canActivate: [AuthenticationGuard, ManagerGuard, ActiveShopGuard],
    loadChildren: () => import('@smartstocktz/stocks').then(mod => mod.StockModule)
  },
  {
    path: 'purchase',
    canActivate: [AuthenticationGuard, ManagerGuard, ActiveShopGuard],
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
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    LibModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production && environment.electron === false}),
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
export class SmartstockModule {
  constructor() {
    // @ts-ignore
    import('../../package.json').then(pkg => {
      LibModule.start({
        version: pkg.version,
        production: true,
        electron: true,
        browser: true
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
