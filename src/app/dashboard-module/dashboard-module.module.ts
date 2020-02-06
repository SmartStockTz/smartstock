import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardModuleRoutingModule} from './dashboard-module-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CommonComponentsModule} from '../common-components/common-components.module';
import {
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatTableModule
} from '@angular/material';
import { DashboardQuickReportComponent } from './dashboard-quick-report/dashboard-quick-report.component';
import {ReactiveFormsModule} from '@angular/forms';
import { DashboardSaleTrendsComponent } from './dashboard-sale-trends/dashboard-sale-trends.component';
import { DashboardFrequentSoldProductComponent } from './dashboard-frequent-sold-product/dashboard-frequent-sold-product.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardQuickReportComponent,
    DashboardSaleTrendsComponent,
    DashboardFrequentSoldProductComponent
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
    MatPaginatorModule
  ]
})
export class DashboardModuleModule {
}
