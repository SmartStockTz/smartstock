import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StockModuleRoutingModule} from './stock-module-routing.module';
import {StockComponent, StockDetailsComponent} from './stock/stock.component';
import {CommonComponentsModule} from '../common-components/common-components.module';
import {
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {StockNewComponent} from './stock-new/stock-new.component';
import {StockEditComponent} from './stock-edit/stock-edit.component';
import {CategoriesComponent, DialogCategoryDeleteComponent, DialogCategoryNewComponent} from './categories/categories.component';
import {DialogSupplierDeleteComponent, DialogSupplierNewComponent, SuppliersComponent} from './suppliers/suppliers.component';
import {DialogUnitDeleteComponent, DialogUnitNewComponent, UnitsComponent} from './units/units.component';

@NgModule({
  imports: [
    CommonModule,
    StockModuleRoutingModule,
    CommonComponentsModule,
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule,
    MatRippleModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatExpansionModule,
    MatDialogModule,
  ],
  declarations: [
    StockComponent,
    StockNewComponent,
    StockEditComponent,
    CategoriesComponent,
    SuppliersComponent,
    UnitsComponent,
    StockDetailsComponent,
    DialogCategoryDeleteComponent,
    DialogCategoryNewComponent,
    DialogUnitDeleteComponent,
    DialogUnitNewComponent,
    DialogSupplierNewComponent,
    DialogSupplierDeleteComponent
  ],
  entryComponents: [
    StockDetailsComponent,
    DialogCategoryDeleteComponent,
    DialogCategoryNewComponent,
    DialogUnitDeleteComponent,
    DialogUnitNewComponent,
    DialogSupplierNewComponent,
    DialogSupplierDeleteComponent
  ]
})
export class StockModuleModule {
}
