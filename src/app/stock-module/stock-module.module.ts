import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StockModuleRoutingModule} from './stock-module-routing.module';
import {StockComponent} from './stock/stock.component';
import {CommonComponentsModule} from '../common-components/common-components.module';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';

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
    MatButtonModule
  ],
  declarations: [
    StockComponent
  ]
})
export class StockModuleModule {
}
