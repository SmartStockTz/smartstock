import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SalesModuleRoutingModule} from './sales-module-routing.module';
import {WholeSaleComponent} from './whole-sale/whole-sale.component';
import {SaleComponent} from './sale/sale.component';
import {CommonComponentsModule} from '../common-components/common-components.module';
import {
    MatAutocompleteModule, MatButtonModule,
    MatCardModule, MatDatepickerModule, MatDividerModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,
    MatSidenavModule,
    MatSlideToggleModule, MatSortModule, MatTableModule, MatTabsModule, MatTooltipModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import { SaleReportComponent } from './sale-report/sale-report.component';
import { SaleReportTrendComponent } from './sale-report-trend/sale-report-trend.component';
import { SaleReportsProductsComponent } from './sale-reports-products/sale-reports-products.component';
import { CartComponent } from './cart/cart.component';
import { ProductCardComponent } from './product-card/product-card.component';

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
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatSortModule,
        MatTooltipModule
    ],
  declarations: [
    WholeSaleComponent,
    SaleComponent,
    SaleReportComponent,
    SaleReportTrendComponent,
    SaleReportsProductsComponent,
    CartComponent,
    ProductCardComponent
  ]
})
export class SalesModuleModule {
}
