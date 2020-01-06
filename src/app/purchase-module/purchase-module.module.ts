import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PurchaseModuleRoutingModule} from './purchase-module-routing.module';
import {PurchaseComponent} from './purchase/purchase.component';
import {
  MatAutocompleteModule, MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule,
  MatSidenavModule,
  MatSlideToggleModule, MatTableModule, MatTabsModule
} from '@angular/material';
import {CommonComponentsModule} from '../common-components/common-components.module';
import {ReactiveFormsModule} from '@angular/forms';
import { PurchasesAllComponent } from './purchase/purchases-all/purchases-all.component';
import { PurchasesInvoiceComponent } from './purchase/purchases-invoice/purchases-invoice.component';
import { PurchasesReceiptsComponent } from './purchase/purchases-receipts/purchases-receipts.component';


@NgModule({
  declarations: [
    PurchaseComponent,
    PurchasesAllComponent,
    PurchasesInvoiceComponent,
    PurchasesReceiptsComponent,
  ],
  imports: [
    CommonModule,
    PurchaseModuleRoutingModule,
    MatSidenavModule,
    CommonComponentsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule
  ]
})
export class PurchaseModuleModule {
}
