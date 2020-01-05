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
  MatDatepickerModule, MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSidenavModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {StockNewComponent} from './stock-new/stock-new.component';
import {StockEditComponent} from './stock-edit/stock-edit.component';
import {CategoriesComponent} from './categories/categories.component';
import {SuppliersComponent} from './suppliers/suppliers.component';
import {UnitsComponent} from './units/units.component';

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
  ],
  declarations: [
    StockComponent,
    StockNewComponent,
    StockEditComponent,
    CategoriesComponent,
    SuppliersComponent,
    UnitsComponent,
    StockDetailsComponent
  ],
  entryComponents: [
    StockDetailsComponent
  ]
})
export class StockModuleModule {
}
