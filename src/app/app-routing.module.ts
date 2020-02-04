import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {AdminRoleGuard} from './guards/admin-role.guard';
import {AuthenticationGuard} from './guards/authentication.guard';
import {AuthenticatedUserGuard} from './guards/authenticated-user.guard';
import {StockExistGuard} from './guards/stock-exist.guard';
import {LandingComponent} from './landing/landing.component';
import {ChooseShopComponent} from './choose-shop/choose-shop.component';
import {ActiveShopGuard} from './guards/active-shop.guard';
import {StockManagerGuard} from './guards/stock-manager.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthenticatedUserGuard],
    component: LandingComponent
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
    canActivate: [AdminRoleGuard],
    component: ChooseShopComponent
  },
  {
    path: 'dashboard',
    canActivate: [AdminRoleGuard, ActiveShopGuard],
    loadChildren: () => import('./dashboard-module/dashboard-module.module').then(mod => mod.DashboardModuleModule)
  },
  {
    path: 'sale',
    canActivate: [AuthenticationGuard, StockExistGuard, ActiveShopGuard],
    loadChildren: () => import('./sales-module/sales-module.module').then(mod => mod.SalesModuleModule)
  },
  {
    path: 'stock',
    canActivate: [StockManagerGuard, ActiveShopGuard],
    loadChildren: () => import('./stock-module/stock-module.module').then(mod => mod.StockModuleModule)
  },
  {
    path: 'purchase',
    canActivate: [StockManagerGuard, ActiveShopGuard],
    loadChildren: () => import('./purchase-module/purchase-module.module').then(mod => mod.PurchaseModuleModule)
  },
  {
    path: 'settings',
    canActivate: [AdminRoleGuard, ActiveShopGuard],
    loadChildren: () => import('./settings-module/settings-module.module').then(mod => mod.SettingsModuleModule)
  },
  {
    path: 'home',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
