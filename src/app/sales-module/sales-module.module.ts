import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SalesModuleRoutingModule} from './sales-module-routing.module';
import {WholeSaleComponent} from './whole-sale/whole-sale.component';
import {SaleComponent} from './sale/sale.component';
import {CommonComponentsModule} from '../common-components/common-components.module';
import {
  MatAutocompleteModule, MatButtonModule,
  MatCardModule, MatDividerModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatPaginatorModule,
  MatSidenavModule,
  MatSlideToggleModule, MatTableModule, MatTabsModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SalesModuleRoutingModule,
    CommonComponentsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  declarations: [
    WholeSaleComponent,
    SaleComponent
  ]
})
export class SalesModuleModule {
}
