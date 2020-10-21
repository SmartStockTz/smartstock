import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {environment} from '../../../../environments/environment';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-sales-reports',
  template: `
      <div>
          <mat-sidenav-container class="my-drawer-container">

              <mat-sidenav
                      [fixedInViewport]="true"
                      class="match-parent-side"
                      #sidenav [mode]="enoughWidth()?'side':'over'"
                      [opened]="enoughWidth()">
                  <smartstock-drawer></smartstock-drawer>
              </mat-sidenav>

              <mat-sidenav-content>
                  <smartstock-toolbar [heading]="'REPORT'" [sidenav]="sidenav" [showProgress]="false"></smartstock-toolbar>


                  <div [ngStyle]="{padding: (isMobile || !enoughWidth())?'24px 0':'40px 16px'}"
                       [ngClass]="(isMobile || !enoughWidth())?'container-fluid':'container'">
                      <div class="col-12 col-lg-10 col-xl-10 offset-xl-1 offset-lg-1 offset-md-0 offset-sm-0">
                          <div class="row">
                              <div style="margin-bottom: 10px" class="col-12">
                                  <smartstock-profit-by-category style="margin-bottom: 1em"></smartstock-profit-by-category>
                              </div>
                              <div style="margin-bottom: 10px" class="col-12">
                                  <smartstock-product-performance-report style="margin-bottom: 1em"></smartstock-product-performance-report>
                              </div>

                              <div style="margin-bottom: 10px" class="col-12">
                                  <smartstock-dashboard-sale-trends></smartstock-dashboard-sale-trends>
                              </div>
                              <div style="margin-bottom: 10px" class="col-12">
                                  <smartstock-cart-report></smartstock-cart-report>
                              </div>
                          </div>
                          <!--<div class="row">-->
                          <!--<div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">-->
                          <!--<smartstock-expired-products-report></smartstock-expired-products-report>-->
                          <!--</div>-->
                          <!--<div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">-->
                          <!--<smartstock-products-about-to-expire></smartstock-products-about-to-expire>-->
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
export class SalesPageComponent extends DeviceInfoUtil implements OnInit {
  isMobile = environment.android;

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
