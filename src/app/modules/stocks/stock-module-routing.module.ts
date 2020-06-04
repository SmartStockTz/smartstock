import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StockComponent} from './stock/stock.component';
import {StockNewComponent} from './stock-new/stock-new.component';
import {StockEditComponent} from './stock-edit/stock-edit.component';
import {StockProductsComponent} from '../mobile-ui/stock-mobile/stock-products/stock-products.component';
import {CategoriesComponent} from '../mobile-ui/stock-mobile/categories/categories.component';
import {SuppliersComponent} from '../mobile-ui/stock-mobile/suppliers/suppliers.component';
import {UnitsComponent} from '../mobile-ui/stock-mobile/units/units.component';

const routes: Routes = [
  {path: '', component: StockComponent},
  {path: 'products', component: StockProductsComponent},
  {path: 'categories', component: CategoriesComponent},
  {path: 'suppliers', component: SuppliersComponent},
  {path: 'units', component: UnitsComponent},
  {path: 'create', component: StockNewComponent},
  {path: 'edit/:objectId', component: StockEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockModuleRoutingModule {
}