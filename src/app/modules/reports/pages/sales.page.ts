import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
/******* move to common *****/
import {DeviceInfo} from '../../shared/DeviceInfo';
/******* move to common *****/
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-sales-reports',
  template: `
    <div>
      <mat-sidenav-container class="my-drawer-container">

        <mat-sidenav
          [fixedInViewport]="true"
          class="match-parent-side"
          #sidenav [mode]="enoughWidth()?'side':'over'"
          [opened]="enoughWidth()">
          <app-admin-drawer></app-admin-drawer>
        </mat-sidenav>

        <mat-sidenav-content>
          <app-toolbar [heading]="'REPORT'" [sidenav]="sidenav" [showProgress]="false"></app-toolbar>


          <div [ngStyle]="{padding: (isMobile || !enoughWidth())?'24px 0':'40px 16px'}"
               [ngClass]="(isMobile || !enoughWidth())?'container-fluid':'container'">
            <div class="col-12 col-lg-10 col-xl-10 offset-xl-1 offset-lg-1 offset-md-0 offset-sm-0">
              <div class="row">
                <div style="margin-bottom: 10px" class="col-12">
                  <app-profit-by-category style="margin-bottom: 1em"></app-profit-by-category>
                </div>
                <div style="margin-bottom: 10px" class="col-12">
                  <app-product-performance-report style="margin-bottom: 1em"></app-product-performance-report>
                </div>

                <div style="margin-bottom: 10px" class="col-12">
                  <app-dashboard-sale-trends></app-dashboard-sale-trends>
                </div>
                <div style="margin-bottom: 10px" class="col-12">
                  <app-cart-report></app-cart-report>
                </div>
              </div>
              <!--<div class="row">-->
              <!--<div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">-->
              <!--<app-expired-products-report></app-expired-products-report>-->
              <!--</div>-->
              <!--<div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">-->
              <!--<app-products-about-to-expire></app-products-about-to-expire>-->
              <!--</div>-->
              <!--</div>-->
            </div>
          </div>

        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styleUrls: ['../styles/sales.style.css']
})
export class SalesPageComponent extends DeviceInfo implements OnInit {
  isMobile = environment.android;

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
