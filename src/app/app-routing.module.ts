import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminRoleGuard} from './guards/admin-role.guard';
import {AuthenticationGuard} from './guards/authentication.guard';
import {ActiveShopGuard} from './guards/active-shop.guard';
import {StockManagerGuard} from './guards/stock-manager.guard';
import {LandingComponent} from './main-module/landing/landing.component';
import {PrivacyComponent} from './main-module/privacy/privacy.component';
import {AuthenticatedUserGuard} from './guards/authenticated-user.guard';
import {LoginComponent} from './main-module/login/login.component';
import {RegisterComponent} from './main-module/register/register.component';
import {ChooseShopComponent} from './main-module/choose-shop/choose-shop.component';

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
    loadChildren: () => import('./dashboard-module/dashboard-module.module').then(mod => mod.DashboardModuleModule)
  },
  {
    path: 'sale',
    canActivate: [AuthenticationGuard, ActiveShopGuard],
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
    canActivate: [AuthenticationGuard, ActiveShopGuard],
    loadChildren: () => import('./settings-module/settings-module.module').then(mod => mod.SettingsModuleModule)
  },
  {
    path: 'home',
    redirectTo: 'dashboard'
  },
  {
    path: '**', loadChildren: () => import('./main-module/main-module.module').then(mod => mod.MainModuleModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
