import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportsRoutingModule} from './reports-routing.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ExpiredProductsReportComponent} from './stock-reports/expired-products-report/expired-products-report.component';
import {StockReportsComponent} from './stock-reports/stock-reports.component';
import {StockReorderReportComponent} from './stock-reports/stock-reorder-report/stock-reorder-report.component';
import {DashboardModuleRoutingModule} from '../dashboard/dashboard-module-routing.module';
import {CommonComponentsModule} from '../shared/common-components.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {SatDatepickerModule, SatNativeDateModule} from 'saturn-datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {DashboardModuleModule} from '../dashboard/dashboard-module.module';
import {MatMenuModule} from '@angular/material/menu';
import {SalesReportsComponent} from './sales-reports/sales-reports.component';


@NgModule({
  declarations: [
    ExpiredProductsReportComponent,
    StockReportsComponent, StockReorderReportComponent,
    TabularReportComponent, ProductsAboutToExpireComponent,
    CartReportComponent,
    SalesReportsComponent
  ],
  exports: [
    ExpiredProductsReportComponent,
    StockReportsComponent,
    StockReorderReportComponent,
    ProductsAboutToExpireComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatDatepickerModule,
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
    MatInputModule,
    MatMenuModule,
    DashboardModuleModule
  ]
})
export class ReportsModule {
}
