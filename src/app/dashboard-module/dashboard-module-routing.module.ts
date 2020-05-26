import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GeneralDashboardComponent} from './general-dashboard/general-dashboard.component';
import {SalesReportsComponent} from './reports/sales-reports/sales-reports.component';
import {StockReportsComponent} from './reports/stock-reports/stock-reports.component';


const routes: Routes = [
  {path: '', component: GeneralDashboardComponent},
  {path: 'sales-reports', component: SalesReportsComponent},
  {path: 'stock-reports', component: StockReportsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardModuleRoutingModule {
}
