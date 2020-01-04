import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PurchaseComponent} from './purchase/purchase.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'admin', component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'sale', loadChildren: () => import('./sales-module/sales-module.module').then(mod => mod.SalesModuleModule)},
  {path: 'stock', loadChildren: () => import('./stock-module/stock-module.module').then(mod => mod.StockModuleModule)},
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
