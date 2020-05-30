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
import {SalesGeneralComponent} from './sales/general/sales-general.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SalesTrendsComponent} from './sales/trends/sales-trends.component';
import {SalesProductFrequencyComponent} from './sales/product-frequency/sales-product-frequency.component';
import {DataNotReadyComponent} from './data-not-ready/data-not-ready.component';
import {SalesDashboardComponent} from './sales/sales-dashboard.component';
import {SalesReportsComponent} from '../reports/sales-reports/sales-reports.component';
import {StockReportsComponent} from '../reports/stock-reports/stock-reports.component';
import {StockReorderReportComponent} from '../reports/stock-reports/stock-reorder-report/stock-reorder-report.component';
import {MatNativeDateModule} from '@angular/material/core';
import {ProductPerformanceReportComponent} from '../reports/sales-reports/product-performance-report/product-performance-report.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import { TotalSalesComponent } from './sales/general/total-sales/total-sales.component';
import {SatDatepickerModule, SatNativeDateModule} from 'saturn-datepicker';
import { DateRangeSelectorComponent } from './date-range-selector/date-range-selector.component';

@NgModule({
  declarations: [
    SalesGeneralComponent,
    SalesTrendsComponent,
    SalesProductFrequencyComponent,
    DataNotReadyComponent,
    SalesDashboardComponent,
    StockReportsComponent,
    StockReorderReportComponent,
    SalesReportsComponent,
    ProductPerformanceReportComponent,
    TotalSalesComponent,
    DateRangeSelectorComponent

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
  ]
})
export class DashboardModuleModule {
}
