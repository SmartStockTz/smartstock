import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StockComponent} from './stock/stock.component';
import {StockNewComponent} from './stock-new/stock-new.component';
import {StockEditComponent} from './stock-edit/stock-edit.component';

const routes: Routes = [
  {path: '', component: StockComponent},
  {path: 'create', component: StockNewComponent},
  {path: 'edit/:objectId', component: StockEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockModuleRoutingModule {
}
