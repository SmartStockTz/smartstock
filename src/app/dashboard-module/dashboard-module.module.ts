import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardModuleRoutingModule} from './dashboard-module-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CommonComponentsModule} from '../shared-components/common-components.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { DashboardQuickReportComponent } from './dashboard-quick-report/dashboard-quick-report.component';
import {ReactiveFormsModule} from '@angular/forms';
import { DashboardSaleTrendsComponent } from './dashboard-sale-trends/dashboard-sale-trends.component';
import { DashboardFrequentSoldProductComponent } from './dashboard-frequent-sold-product/dashboard-frequent-sold-product.component';
import { DataNotReadyComponent } from './data-not-ready/data-not-ready.component';
import { GeneralDashboardComponent } from './general-dashboard/general-dashboard.component';
import { SalesReportsComponent } from './reports/sales-reports/sales-reports.component';
import { StockReportsComponent } from './reports/stock-reports/stock-reports.component';
import { StockReorderReportComponent } from './reports/stock-reports/stock-reorder-report/stock-reorder-report.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ProductPerformanceReportComponent } from './reports/sales-reports/product-performance-report/product-performance-report.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardQuickReportComponent,
    DashboardSaleTrendsComponent,
    DashboardFrequentSoldProductComponent,
    DataNotReadyComponent,
    GeneralDashboardComponent,
    StockReportsComponent,
    StockReorderReportComponent,
    SalesReportsComponent,
    ProductPerformanceReportComponent 

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
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatSelectModule
  ]
})
export class DashboardModuleModule {
}
