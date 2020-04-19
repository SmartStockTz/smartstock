import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardModuleRoutingModule} from './dashboard-module-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CommonComponentsModule} from '../common-components/common-components.module';
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

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardQuickReportComponent,
    DashboardSaleTrendsComponent,
    DashboardFrequentSoldProductComponent,
    DataNotReadyComponent,
    GeneralDashboardComponent
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
    MatProgressSpinnerModule
  ]
})
export class DashboardModuleModule {
}
