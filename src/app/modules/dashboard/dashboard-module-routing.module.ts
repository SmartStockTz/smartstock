import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SalesDashboardComponent} from './sales/sales-dashboard.component';
import {StockReportsComponent} from '../reports/stock-reports/stock-reports.component';


const routes: Routes = [
  {path: '', redirectTo: 'sales', pathMatch: 'full'},
  {path: 'sales', component: SalesDashboardComponent},
  {path: 'stock', component: StockReportsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardModuleRoutingModule {
}
