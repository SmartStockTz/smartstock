import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {DeviceInfoUtil} from '@smartstock/core-libs';

@Component({
  selector: 'smartstock-stock-reports',
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


                  <div [ngStyle]="{padding: (isMobile || !enoughWidth())?'24px 0':'24px 16px'}"
                       [ngClass]="(isMobile || !enoughWidth())?'container-fluid':'container'">
                      <div class="col-12 col-lg-10 col-xl-10 offset-xl-1 offset-lg-1 offset-md-0 offset-sm-0">
                          <div class="row">
                              <div style="margin-bottom: 10px" class="col-12">
                                  <smartstock-stock-reorder-report></smartstock-stock-reorder-report>
                              </div>
                          </div>
                          <div class="row">
                              <div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                  <smartstock-expired-products-report></smartstock-expired-products-report>
                              </div>
                              <div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                  <smartstock-products-about-to-expire></smartstock-products-about-to-expire>
                              </div>
                          </div>
                      </div>
                  </div>

              </mat-sidenav-content>
          </mat-sidenav-container>
      </div>
  `,
  styleUrls: ['../styles/stock.style.css']
})
export class StockPageComponent extends DeviceInfoUtil implements OnInit {
  isMobile = environment.android;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
