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
import {SalesGeneralComponent} from './general/sales-general.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SalesTrendsComponent} from './trends/sales-trends.component';
import {SalesProductFrequencyComponent} from './product-frequency/sales-product-frequency.component';
import {DataNotReadyComponent} from '../shared/data-not-ready/data-not-ready.component';
import {DashboardComponent} from './landing/dashboard.component';
import {SalesReportsComponent} from '../reports/sales-reports/sales-reports.component';
import {StockReportsComponent} from '../reports/stock-reports/stock-reports.component';
import {StockReorderReportComponent} from '../reports/stock-reports/stock-reorder-report/stock-reorder-report.component';
import {MatNativeDateModule} from '@angular/material/core';
import {ProductPerformanceReportComponent} from '../reports/sales-reports/product-performance-report/product-performance-report.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import { TotalSalesComponent } from './total-sales/total-sales.component';
import {SatDatepickerModule, SatNativeDateModule} from 'saturn-datepicker';
import { DateRangeSelectorComponent } from './date-range-selector/date-range-selector.component';
import { CurrentShopComponent } from './current-shop/current-shop.component';
import {MatDividerModule} from '@angular/material/divider';
import { DashCardComponent } from './dash-card/dash-card.component';
import {ReportsModule} from '../reports/reports.module';

@NgModule({
  declarations: [
    SalesGeneralComponent,
    SalesTrendsComponent,
    SalesProductFrequencyComponent,
    DashboardComponent,
    ProductPerformanceReportComponent,
    TotalSalesComponent,
    DateRangeSelectorComponent,
    CurrentShopComponent,
    DashCardComponent
  ],
  exports:[
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
