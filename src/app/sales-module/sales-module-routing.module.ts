import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WholeSaleComponent} from './whole-sale/whole-sale.component';
import {SaleReportComponent} from './sale-report/sale-report.component';
import {RetailSaleComponent} from './retail-sale/retail-sale.component';

const routes: Routes = [
  {path: '', component: RetailSaleComponent},
  {path: 'whole', component: WholeSaleComponent},
  {path: 'retail', component: RetailSaleComponent},
  {path: 'report', component: SaleReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesModuleRoutingModule {
}
