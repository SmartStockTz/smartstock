import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {environment} from '../../../../environments/environment';
import {Subject} from 'rxjs';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {DashboardState} from '../states/dashboard.state';

@Component({
  selector: 'smartstock-dashboard-sales',
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

              <mat-sidenav-content (swiperight)="openDrawer(sidenav)">

                  <smartstock-toolbar [heading]="'Dashboard'" [sidenav]="sidenav"
                                      [showProgress]="false"></smartstock-toolbar>

                  <div [ngStyle]="{padding: (isMobile || !enoughWidth())?'24px 0':'24px 16px', marginBottom: '24px'}"
                       [ngClass]="(isMobile || !enoughWidth())?'container-fluid':'container'">
                      <div class="col-12 col-lg-10 col-xl-10 offset-xl-1 offset-lg-1 offset-md-0 offset-sm-0">
                          <smartstock-current-shop (dateSelected)="dateSelected($event)"></smartstock-current-shop>
                          <p style="padding: 10px 0">
                              How are your sales performing?
                          </p>
                          <div class="row">
                              <div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                  <smartstock-dash-card [title]="'Total Sales'"
                                                        reportLink="/report/sales"
                                                        [content]="totalSaleComponent"
                                                        description="Total sale over specified period">
                                      <ng-template #totalSaleComponent>
                                          <smartstock-total-sales [initialDataRange]="initialRange"
                                                                  [dateRange]="dateRange"></smartstock-total-sales>
                                      </ng-template>
                                  </smartstock-dash-card>
                              </div>
                              <div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                  <smartstock-dash-card [title]="'Gross Profit'"
                                                        [content]="totalGrossProfit"
                                                        reportLink="/report/sales"
                                                        description="Total gross profit over specified period">
                                      <ng-template #totalGrossProfit>
                                          <smartstock-total-gross-sale [initialDataRange]="initialRange"
                                                                       [dateRange]="dateRange"></smartstock-total-gross-sale>
                                      </ng-template>
                                  </smartstock-dash-card>
                              </div>
                          </div>

                          <p style="padding: 10px 0">
                              How are your stocks performing?
                          </p>

                          <div class="row">
                              <div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                  <smartstock-dash-card [title]="'Stocks Health'"
                                                        [content]="stockHealth"
                                                        [reportLink]="'/report/stocks'"
                                                        description="Comparison of your total stocks and out of stock product">
                                      <ng-template #stockHealth>
                                          <smartstock-stock-status></smartstock-stock-status>
                                      </ng-template>
                                  </smartstock-dash-card>
                              </div>
                              <div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                  <smartstock-dash-card [title]="'Category Wise'"
                                                        [reportLink]="'/report/stocks'"
                                                        [content]="stockByCategory"
                                                        description="Category distribution of your stocks">
                                      <ng-template #stockByCategory>
                                          <smartstock-stock-by-category></smartstock-stock-by-category>
                                      </ng-template>
                                  </smartstock-dash-card>
                              </div>
                          </div>

                          <!--          <div class="row">-->
                          <!--            <div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">-->
                          <!--              <smartstock-dash-card [title]="'Expired'"-->
                          <!--                             [content]="stockExpire"-->
                          <!--                             description="Total expired products">-->
                          <!--                <ng-template #stockExpire>-->
                          <!--                  <smartstock-stock-expired></smartstock-stock-expired>-->
                          <!--                </ng-template>-->
                          <!--              </smartstock-dash-card>-->
                          <!--            </div>-->
                          <!--          </div>-->

                      </div>
                  </div>

                  <smartstock-bottom-bar *ngIf="isMobile && !enoughWidth()"></smartstock-bottom-bar>
              </mat-sidenav-content>
          </mat-sidenav-container>
      </div>
  `,
  styleUrls: ['../styles/dashboard.style.css']
})
export class DashboardPageComponent extends DeviceInfoUtil implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  isMobile = environment.android;
  dateRange = new Subject<{ begin: Date; end: Date }>();
  initialRange: { begin: Date; end: Date };

  constructor(public readonly dashboardState: DashboardState) {
    super();
  }

  ngOnInit() {
    setTimeout(() => {
      this.dashboardState.addTest(40);
      setTimeout(() => {
        this.dashboardState.reduceTest(30);
      }, 4000);
    }, 1000);
  }

  dateSelected(dateRange: { begin: Date; end: Date }) {
    this.initialRange = dateRange;
    this.dateRange.next(dateRange);
  }
}
