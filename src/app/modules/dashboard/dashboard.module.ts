import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {SalesTrendsComponent} from './components/sales-trends.component';
import {SalesProductFrequencyComponent} from './components/sales-product-frequency.component';
import {DashboardPageComponent} from './pages/dashboard.page';
import {MatNativeDateModule} from '@angular/material/core';
import {ProductPerformanceComponent} from '../reports/components/product-performance.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {TotalSalesComponent} from './components/total-sales.component';
import {SatDatepickerModule, SatNativeDateModule} from 'saturn-datepicker';
import {DateRangeHeaderComponent} from './components/date-range-header.component';
import {DateRangeComponent} from './components/date-range.component';
import {MatDividerModule} from '@angular/material/divider';
import {TotalGrossSaleComponent} from './components/total-gross-sale.component';
import {StockStatusComponent} from './components/stock-status.component';
import {StockByCategoryComponent} from './components/stock-by-category.component';
import {StockExpiredComponent} from './components/stock-expired.component';
import {RouterModule, Routes} from '@angular/router';
import {LibModule} from '../lib/lib.module';


const routes: Routes = [
  {path: '', component: DashboardPageComponent},
];

@NgModule({
  declarations: [
    SalesTrendsComponent,
    SalesProductFrequencyComponent,
    DashboardPageComponent,
    ProductPerformanceComponent,
    TotalSalesComponent,
    DateRangeHeaderComponent,
    DateRangeComponent,
    TotalGrossSaleComponent,
    StockStatusComponent,
    StockByCategoryComponent,
    StockExpiredComponent
  ],
  exports: [
    ProductPerformanceComponent,
    SalesTrendsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LibModule,
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
export class DashboardModule {
}
