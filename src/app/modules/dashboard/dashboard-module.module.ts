import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardModuleRoutingModule} from './dashboard-module-routing.module';
import {CommonComponentsModule} from '../shared/common-components.module';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {ReactiveFormsModule} from '@angular/forms';
import {SalesTrendsComponent} from './trends/sales-trends.component';
import {SalesProductFrequencyComponent} from './product-frequency/sales-product-frequency.component';
import {DashboardComponent} from './landing/dashboard.component';
import {MatNativeDateModule} from '@angular/material/core';
import {ProductPerformanceReportComponent} from '../reports/sales-reports/product-performance-report/product-performance-report.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {TotalSalesComponent} from './total-sales/total-sales.component';
import {SatDatepickerModule, SatNativeDateModule} from 'saturn-datepicker';
import {DateRangeHeaderComponent} from './date-range-header/date-range-header.component';
import {DateRangeComponent} from './date-range/date-range.component';
import {MatDividerModule} from '@angular/material/divider';
import {DashCardComponent} from './dash-card/dash-card.component';
import {TotalGrossSaleComponent} from './total-gross-sale/total-gross-sale.component';
import {StockStatusComponent} from './stock-status/stock-status.component';
import { StockByCategoryComponent } from './stock-by-category/stock-by-category.component';
import { StockExpiredComponent } from './stock-expired/stock-expired.component';

@NgModule({
  declarations: [
    SalesTrendsComponent,
    SalesProductFrequencyComponent,
    DashboardComponent,
    ProductPerformanceReportComponent,
    TotalSalesComponent,
    DateRangeHeaderComponent,
    DateRangeComponent,
    DashCardComponent,
    TotalGrossSaleComponent,
    StockStatusComponent,
    StockByCategoryComponent,
    StockExpiredComponent
  ],
  exports: [
    ProductPerformanceReportComponent,
    SalesTrendsComponent
  ],
  imports: [
    CommonModule,
    DashboardModuleRoutingModule,
    CommonComponentsModule,
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatSelectModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatDividerModule,
  ]
})
export class DashboardModuleModule {
}
