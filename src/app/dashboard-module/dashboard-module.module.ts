import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardModuleRoutingModule} from './dashboard-module-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CommonComponentsModule} from '../common-components/common-components.module';
import {MatSidenavModule} from '@angular/material';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardModuleRoutingModule,
    CommonComponentsModule,
    MatSidenavModule
  ]
})
export class DashboardModuleModule {
}
