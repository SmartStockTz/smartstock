import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PurchaseModuleRoutingModule} from './purchase-module-routing.module';
import {PurchaseComponent} from './purchase/purchase.component';


@NgModule({
  declarations: [
    PurchaseComponent,
  ],
  imports: [
    CommonModule,
    PurchaseModuleRoutingModule
  ]
})
export class PurchaseModuleModule {
}
