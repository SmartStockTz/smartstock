import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PurchaseComponent} from './purchase/purchase.component';
import {PurchaseCreateComponent} from './purchase-create/purchase-create.component';

const routes: Routes = [
  {path: '', component: PurchaseComponent},
  {path: 'create', component: PurchaseCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseModuleRoutingModule {
}
