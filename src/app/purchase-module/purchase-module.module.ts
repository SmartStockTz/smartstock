import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PurchaseModuleRoutingModule} from './purchase-module-routing.module';
import {PurchaseComponent, PurchaseDetailsComponent} from './purchase/purchase.component';
import {
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule, MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import {CommonComponentsModule} from '../common-components/common-components.module';
import {ReactiveFormsModule} from '@angular/forms';
import {PurchasesInvoiceComponent} from './purchases-invoice/purchases-invoice.component';
import {PurchasesReceiptsComponent} from './purchases-receipts/purchases-receipts.component';
import {PurchaseCreateComponent} from './purchase-create/purchase-create.component';


@NgModule({
  declarations: [
    PurchaseComponent,
    PurchasesInvoiceComponent,
    PurchasesReceiptsComponent,
    PurchaseDetailsComponent,
    PurchaseCreateComponent
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
    MatPaginatorModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatSelectModule,
  ],
  entryComponents: [
    PurchaseDetailsComponent
  ]
})
export class PurchaseModuleModule {
}
