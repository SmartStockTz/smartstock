import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './register/register.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', loadChildren: () => import('./dashboard-module/dashboard-module.module').then(mod => mod.DashboardModuleModule)},
  {path: 'sale', loadChildren: () => import('./sales-module/sales-module.module').then(mod => mod.SalesModuleModule)},
  {path: 'stock', loadChildren: () => import('./stock-module/stock-module.module').then(mod => mod.StockModuleModule)},
  {path: 'purchase', loadChildren: () => import('./purchase-module/purchase-module.module').then(mod => mod.PurchaseModuleModule)},
  {path: 'home', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
