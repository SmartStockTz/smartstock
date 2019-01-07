import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SaleComponent} from './sale/sale.component';
import {WholeSaleComponent} from './whole-sale/whole-sale.component';
import {StockComponent} from './stock/stock.component';
import {PurchaseComponent} from './purchase/purchase.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'admin', component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'sale', component: SaleComponent},
  {path: 'whole', component: WholeSaleComponent},
  {path: 'stock', component: StockComponent},
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
