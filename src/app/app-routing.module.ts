import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SaleComponent} from './sales-module/sale/sale.component';
import {WholeSaleComponent} from './sales-module/whole-sale/whole-sale.component';
import {PurchaseComponent} from './purchase/purchase.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'admin', component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'sale', loadChildren: () => import('./sales-module/sales-module.module').then(m => m.SalesModuleModule)},
  {path: 'stock', loadChildren: () => import('./stock-module/stock-module.module').then(m => m.StockModuleModule)},
  {path: 'purchase', component: PurchaseComponent},
  {path: 'home', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
