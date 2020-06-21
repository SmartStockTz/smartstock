import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StockComponent} from './stock/stock.component';
import {StockNewComponent} from './stock-new/stock-new.component';
import {StockEditComponent} from './stock-edit/stock-edit.component';
import {StockProductsMobileUiComponent} from '../mobile-ui/stock-products-mobile-ui/stock-products-mobile-ui.component';
import {CategoriesMobileUiComponent} from '../mobile-ui/categories-mobile-ui/categories-mobile-ui.component';
import {SuppliersMobileUiComponent} from '../mobile-ui/suppliers-mobile-ui/suppliers-mobile-ui.component';
import {UnitsMobileUiComponent} from '../mobile-ui/units-mobile-ui/units-mobile-ui.component';

const routes: Routes = [
  {path: '', component: StockComponent},
  {path: 'products', component: StockProductsMobileUiComponent},
  {path: 'categories', component: CategoriesMobileUiComponent},
  {path: 'suppliers', component: SuppliersMobileUiComponent},
  {path: 'units', component: UnitsMobileUiComponent},
  {path: 'create', component: StockNewComponent},
  {path: 'edit/:objectId', component: StockEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockModuleRoutingModule {
}
