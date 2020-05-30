import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminRoleGuard} from './guards/admin-role.guard';
import {AuthenticationGuard} from './guards/authentication.guard';
import {ActiveShopGuard} from './guards/active-shop.guard';
import {StockManagerGuard} from './guards/stock-manager.guard';
import {LandingComponent} from './landing/landing/landing.component';
import {PrivacyComponent} from './landing/privacy/privacy.component';
import {AuthenticatedUserGuard} from './guards/authenticated-user.guard';
import {LoginComponent} from './landing/login/login.component';
import {RegisterComponent} from './landing/register/register.component';
import {ChooseShopComponent} from './landing/choose-shop/choose-shop.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {
    path: 'privacy',
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
    loadChildren: () => import('./modules/sales/sales-module.module').then(mod => mod.SalesModuleModule)
  },
  {
    path: 'stock',
    canActivate: [StockManagerGuard, ActiveShopGuard],
    loadChildren: () => import('./modules/stocks/stock-module.module').then(mod => mod.StockModuleModule)
  },
  {
    path: 'purchase',
    canActivate: [StockManagerGuard, ActiveShopGuard],
    loadChildren: () => import('./modules/purchase/purchase-module.module').then(mod => mod.PurchaseModuleModule)
  },
  {
    path: 'settings',
    canActivate: [AuthenticationGuard, ActiveShopGuard],
    loadChildren: () => import('./modules/settings/settings-module.module').then(mod => mod.SettingsModuleModule)
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
