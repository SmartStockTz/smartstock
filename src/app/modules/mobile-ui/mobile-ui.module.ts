import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesLandingMobileComponent } from './sales-landing-mobile/sales-landing-mobile.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {CommonComponentsModule} from '../shared/common-components.module';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import {RouterModule} from '@angular/router';
import { BottomBarComponent } from './shared/bottom-bar/bottom-bar.component';



@NgModule({
  declarations: [SalesLandingMobileComponent, BottomBarComponent],
  exports: [
    SalesLandingMobileComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    CommonComponentsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    RouterModule
  ]
})
export class MobileUiModule { }
