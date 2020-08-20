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
import {BrowserPlatformGuard} from './guards/browser-platform.guard';
import {LandingComponent} from './landing/landing/landing.component';
import {PrivacyComponent} from './landing/privacy/privacy.component';
import {AuthenticatedUserGuard} from './guards/authenticated-user.guard';
import {LoginComponent} from './landing/login/login.component';
import {RegisterComponent} from './landing/register/register.component';
import {AuthenticationGuard} from './guards/authentication.guard';
import {ChooseShopComponent} from './landing/choose-shop/choose-shop.component';
import {AdminRoleGuard} from './guards/admin-role.guard';
import {ActiveShopGuard} from './guards/active-shop.guard';
import {KeeperGuard} from './modules/stocks/guards/keeper.guard';
import {LibModule} from './modules/lib/lib.module';

const routes: Routes = [
  {path: '', canActivate: [BrowserPlatformGuard], component: LandingComponent},
  {
    path: 'privacy',
    canActivate: [BrowserPlatformGuard],
    component: PrivacyComponent
  },
  {
    path: 'login',
    canActivate: [AuthenticatedUserGuard],
    component: LoginComponent
  },
  {
    path: 'register',
    canActivate: [AuthenticatedUserGuard],
    component: RegisterComponent
  },
  {
    path: 'shop',
    canActivate: [AuthenticationGuard],
    component: ChooseShopComponent
  },
  {
    path: 'dashboard',
    canActivate: [AdminRoleGuard, ActiveShopGuard],
    loadChildren: () => import('./modules/dashboard/dashboard-module.module').then(mod => mod.DashboardModuleModule)
  },
  {
    path: 'report',
    canActivate: [AdminRoleGuard, ActiveShopGuard],
    loadChildren: () => import('./modules/reports/reports.module').then(mod => mod.ReportsModule)
  },
  {
    path: 'sale',
    canActivate: [AuthenticationGuard, ActiveShopGuard],
    loadChildren: () => import('./modules/sales/sales.module').then(mod => mod.SalesModule)
  },
  {
    path: 'stock',
    canActivate: [KeeperGuard, ActiveShopGuard],
    loadChildren: () => import('./modules/stocks/stock.module').then(mod => mod.StockModule)
  },
  {
    path: 'purchase',
    canActivate: [KeeperGuard, ActiveShopGuard],
    loadChildren: () => import('./modules/purchases/purchases.module').then(mod => mod.PurchasesModule)
  },
  {
    path: 'settings',
    canActivate: [AuthenticationGuard, ActiveShopGuard],
    loadChildren: () => import('./modules/account/account.module').then(mod => mod.AccountModule)
  },
  {
    path: 'home',
    redirectTo: 'dashboard'
  },
  {
    path: '**', loadChildren: () => import('./landing/main-module.module').then(mod => mod.MainModuleModule)
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    BFast.init({
      applicationId: 'smartstock_lb', projectId: 'smartstock', cache: {
        enable: false
      }
    });
  }
}
