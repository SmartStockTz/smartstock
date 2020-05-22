import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SalesModuleRoutingModule} from './sales-module-routing.module';
import {DialogComponent, WholeSaleComponent} from './whole-sale/whole-sale.component';
import {SaleComponent} from './sale/sale.component';
import {CommonComponentsModule} from '../common-components/common-components.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ReactiveFormsModule} from '@angular/forms';
import {SaleReportComponent} from './sale-report/sale-report.component';
import {SaleReportTrendComponent} from './sale-report-trend/sale-report-trend.component';
import {SaleReportsProductsComponent} from './sale-reports-products/sale-reports-products.component';
import {CartComponent} from './cart/cart.component';
import {ProductCardComponent} from './product-card/product-card.component';
import {RetailSaleComponent} from './retail-sale/retail-sale.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatRippleModule} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {ScrollingModule} from '@angular/cdk/scrolling';


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
    MatTooltipModule,
    MatToolbarModule,
    MatBadgeModule,
    MatRippleModule,
    MatListModule,
    ScrollingModule

  ],
  declarations: [
    WholeSaleComponent,
    SaleComponent,
    SaleReportComponent,
    SaleReportTrendComponent,
    SaleReportsProductsComponent,
    CartComponent,
    ProductCardComponent,
    DialogComponent,
    RetailSaleComponent
  ],
})
export class SalesModuleModule {
}
