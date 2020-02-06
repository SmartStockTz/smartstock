import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SaleComponent} from './sale/sale.component';
import {WholeSaleComponent} from './whole-sale/whole-sale.component';
import {SaleReportComponent} from './sale-report/sale-report.component';

const routes: Routes = [
  {path: '', component: SaleComponent},
  {path: 'whole', component: WholeSaleComponent},
  {path: 'report', component: SaleReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesModuleRoutingModule {
}
