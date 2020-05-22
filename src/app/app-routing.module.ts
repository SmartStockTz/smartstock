import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminRoleGuard} from './guards/admin-role.guard';
import {AuthenticationGuard} from './guards/authentication.guard';
import {StockExistGuard} from './guards/stock-exist.guard';
import {ActiveShopGuard} from './guards/active-shop.guard';
import {StockManagerGuard} from './guards/stock-manager.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [],
    loadChildren: () => import('./main-module/main-module.module').then(mod => mod.MainModuleModule)
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
