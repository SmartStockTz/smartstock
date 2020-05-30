import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SalesReportsComponent} from './sales-reports/sales-reports.component';
import {StockReportsComponent} from './stock-reports/stock-reports.component';


const routes: Routes = [
  {path: '', redirectTo: 'sales', pathMatch: 'full'},
  {path: 'sales', component: SalesReportsComponent},
  {path: 'stocks', component: StockReportsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {
}
