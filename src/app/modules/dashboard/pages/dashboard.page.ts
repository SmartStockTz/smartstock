import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {environment} from '../../../../environments/environment';
import {Subject} from 'rxjs';
import {DeviceInfoUtil} from '../../lib/utils/device-info.util';

@Component({
  selector: 'app-dashboard-sales',
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

        <mat-sidenav-content (swiperight)="openDrawer(sidenav)">

          <app-toolbar [heading]="'Dashboard'" [sidenav]="sidenav"
                       [showProgress]="false"></app-toolbar>

          <div [ngStyle]="{padding: (isMobile || !enoughWidth())?'24px 0':'24px 16px', marginBottom: '24px'}"
               [ngClass]="(isMobile || !enoughWidth())?'container-fluid':'container'">
            <div class="col-12 col-lg-10 col-xl-10 offset-xl-1 offset-lg-1 offset-md-0 offset-sm-0">
              <app-current-shop (dateSelected)="dateSelected($event)"></app-current-shop>
              <p style="padding: 10px 0">
                How are your sales performing?
              </p>
              <div class="row">
                <div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                  <app-dash-card [title]="'Total Sales'"
                                 reportLink="/report/sales"
                                 [content]="totalSaleComponent"
                                 description="Total sale over specified period">
                    <ng-template #totalSaleComponent>
                      <app-total-sales [initialDataRange]="initialRange" [dateRange]="dateRange"></app-total-sales>
                    </ng-template>
                  </app-dash-card>
                </div>
                <div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                  <app-dash-card [title]="'Gross Profit'"
                                 [content]="totalGrossProfit"
                                 reportLink="/report/sales"
                                 description="Total gross profit over specified period">
                    <ng-template #totalGrossProfit>
                      <app-total-gross-sale [initialDataRange]="initialRange"
                                            [dateRange]="dateRange"></app-total-gross-sale>
                    </ng-template>
                  </app-dash-card>
                </div>
              </div>

              <p style="padding: 10px 0">
                How are your stocks performing?
              </p>

              <div class="row">
                <div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                  <app-dash-card [title]="'Stocks Health'"
                                 [content]="stockHealth"
                                 [reportLink]="'/report/stocks'"
                                 description="Comparison of your total stocks and out of stock product">
                    <ng-template #stockHealth>
                      <app-stock-status></app-stock-status>
                    </ng-template>
                  </app-dash-card>
                </div>
                <div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                  <app-dash-card [title]="'Category Wise'"
                                 [reportLink]="'/report/stocks'"
                                 [content]="stockByCategory"
                                 description="Category distribution of your stocks">
                    <ng-template #stockByCategory>
                      <app-stock-by-category></app-stock-by-category>
                    </ng-template>
                  </app-dash-card>
                </div>
              </div>

              <!--          <div class="row">-->
              <!--            <div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">-->
              <!--              <app-dash-card [title]="'Expired'"-->
              <!--                             [content]="stockExpire"-->
              <!--                             description="Total expired products">-->
              <!--                <ng-template #stockExpire>-->
              <!--                  <app-stock-expired></app-stock-expired>-->
              <!--                </ng-template>-->
              <!--              </app-dash-card>-->
              <!--            </div>-->
              <!--          </div>-->

            </div>
          </div>

          <app-bottom-bar *ngIf="isMobile && !enoughWidth()"></app-bottom-bar>
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

  constructor() {
    super();
  }

  ngOnInit() {
  }

  dateSelected(dateRange: { begin: Date; end: Date }) {
    this.initialRange = dateRange;
    this.dateRange.next(dateRange);
  }
}
