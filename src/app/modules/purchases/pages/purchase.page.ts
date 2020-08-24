import {Component, OnInit} from '@angular/core';
/** must be removed to common module **/
/** must be removed to common module **/
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {PurchaseModel} from '../models/purchase.model';
import {environment} from '../../../../environments/environment';
import {PurchaseDetailsComponent} from '../components/details.component';
import {PurchaseState} from '../states/purchase.state';
import {DeviceInfoUtil} from '../../lib/utils/device-info.util';

@Component({
  selector: 'smartstock-purchase',
  template: `
    <mat-sidenav-container class="match-parent">

      <mat-sidenav class="match-parent-side" #sidenav [mode]="enoughWidth()?'side':'over'" [opened]="enoughWidth()">
        <smartstock-admin-drawer></smartstock-admin-drawer>
      </mat-sidenav>

      <mat-sidenav-content (swiperight)="openDrawer(sidenav)">
        <smartstock-toolbar [heading]="'Purchases'"
                     (searchCallback)="handleSearch($event)"
                     [showSearch]="true"
                     searchPlaceholder="Search purchase"
                     [sidenav]="sidenav" [showProgress]="false">
        </smartstock-toolbar>

        <div *ngIf="!isMobile" style="margin-top: 16px" class="container">
          <mat-tab-group color="primary">
            <mat-tab label="All">
              <mat-card class="mat-elevation-z0">
                <mat-card-title class="d-flex flex-row flex-nowrap">
                  <button routerLink="/purchase/create" mat-flat-button color="primary" class="ft-button">Add Purchase
                  </button>
                  <span class="toolbar-spacer"></span>
                  <button *ngIf="!getPurchaseProgress" [matMenuTriggerFor]="pAoptions" color="primary" mat-icon-button>
                    <mat-icon>
                      more_vert
                    </mat-icon>
                  </button>
                  <mat-menu #pAoptions>
                    <button mat-menu-item (click)="reload()">Reload</button>
                    <!--      <button mat-menu-item>Export</button>-->
                  </mat-menu>
                </mat-card-title>
                <mat-card-content>


                  <table mat-table [dataSource]="purchasesDatasource"
                         *ngIf="!getPurchaseProgress && purchasesDatasource && purchasesDatasource.data.length>0">
                    <ng-container matColumnDef="refNumber">
                      <th mat-header-cell *matHeaderCellDef>Ref#</th>
                      <td mat-cell *matCellDef="let purchase">{{purchase.refNumber}}</td>
                    </ng-container>
                    <ng-container matColumnDef="channel">
                      <th mat-header-cell *matHeaderCellDef>Channel</th>
                      <td mat-cell *matCellDef="let purchase">{{purchase.type}}</td>
                    </ng-container>
                    <ng-container matColumnDef="amount">
                      <th mat-header-cell *matHeaderCellDef>Amount ( TZS )</th>
                      <td mat-cell *matCellDef="let purchase">{{purchase.amount | number}}</td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let purchase">{{purchase.paid ? 'Paid' : 'Not Paid'}}</td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>
                        <div class="d-flex justify-content-end align-items-end">
                          <span>Actions</span>
                        </div>
                      </th>
                      <td mat-cell *matCellDef="let purchase">
                        <div class="d-flex justify-content-end align-items-end">
                          <button [matMenuTriggerFor]="opts" color="primary" mat-icon-button>
                            <mat-icon>more_vert</mat-icon>
                          </button>
                          <mat-menu #opts>
                            <button (click)="showPurchaseDetails(purchase)" mat-menu-item>View</button>
                            <button (click)="recordPayment(purchase)" mat-menu-item *ngIf="!purchase.paid">Record Payment
                            </button>
                          </mat-menu>
                        </div>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="purchaseTableColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: purchaseTableColumns;"></tr>

                  </table>

                  <mat-card-title style="margin-top: 8px"
                                  *ngIf="!getPurchaseProgress && purchasesDatasource && purchasesDatasource.data.length>0">
                    <button [disabled]="loadMoreProgress" (click)="loadMore()" mat-button color="primary">
                      Load More
                      <mat-progress-spinner style="display: inline-block" [diameter]="20" mode="indeterminate"
                                            *ngIf="loadMoreProgress"
                                            matTooltip="'Load more data'"
                                            color="primary"></mat-progress-spinner>
                    </button>
                  </mat-card-title>

                  <mat-progress-spinner [diameter]="30" mode="indeterminate" color="primary"
                                        *ngIf="getPurchaseProgress"
                                        matTooltip="'Fetching all purchases'"></mat-progress-spinner>
                </mat-card-content>
              </mat-card>

            </mat-tab>
          </mat-tab-group>
        </div>

        <smartstock-purchase-mobile *ngIf="isMobile"></smartstock-purchase-mobile>

        <smartstock-bottom-bar *ngIf="isMobile && !enoughWidth()"></smartstock-bottom-bar>
      </mat-sidenav-content>

    </mat-sidenav-container>


  `,
  styleUrls: ['../styles/purchase.style.css'],
  providers: [
    PurchaseState
  ]
})
export class PurchasePageComponent extends DeviceInfoUtil implements OnInit {
  purchasesDatasource: MatTableDataSource<PurchaseModel>;
  purchaseTableColumns = ['refNumber', 'channel', 'amount', 'status', 'actions'];
  getPurchaseProgress = false;
  loadMoreProgress = false;
  size: 100;
  skip: 0;

  isMobile = environment.android;

  constructor(private readonly purchaseDatabase: PurchaseState,
              private readonly bottomSheet: MatBottomSheet,
              private readonly snack: MatSnackBar) {
    super();
  }

  ngOnInit() {
    this._getAllPurchases();
  }

  handleSearch(query: string) {
    if (query) {
      this.purchasesDatasource.filter = query.toLowerCase();
    } else {
      this.purchasesDatasource.filter = '';
    }
  }

  private _getAllPurchases() {
    this.getPurchaseProgress = true;
    this.purchaseDatabase.getAllPurchase({}).then(value => {
      this.purchasesDatasource = new MatTableDataSource<PurchaseModel>(value);
      this.getPurchaseProgress = false;
    }).catch(reason => {
      this.getPurchaseProgress = false;
      this.snack.open('Fails to get purchases, try again', 'Ok', {
        duration: 3000
      });
      console.log(reason);
    });
  }

  reload() {
    this._getAllPurchases();
  }

  loadMore() {
    this.loadMoreProgress = true;
    this.purchaseDatabase.getAllPurchase({skip: this.purchasesDatasource.data.length}).then(value => {
      if (value.length > 0) {
        const oldData = this.purchasesDatasource.data;
        value.forEach(value1 => {
          oldData.push(value1);
        });
        this.purchasesDatasource = new MatTableDataSource<PurchaseModel>(oldData);
      } else {
        this.snack.open('No more purchases, you have all', 'Ok', {
          duration: 3000
        });
      }
      this.loadMoreProgress = false;
    }).catch(reason => {
      this.loadMoreProgress = false;
      this.snack.open('Fails to load more purchases', 'Ok', {
        duration: 3000
      });
      console.log(reason);
    });
  }

  showPurchaseDetails(purchase: PurchaseModel) {
    this.bottomSheet.open(PurchaseDetailsComponent, {
      data: purchase,
      closeOnNavigation: true,
    });
  }

  recordPayment(purchase: PurchaseModel) {
    this.snack.open('Start update payment record..');
    this.purchaseDatabase.recordPayment(purchase.objectId).then(value => {
      this.snack.open('Payments recorded', 'Ok', {
        duration: 3000
      });
      const oldIndex = this.purchasesDatasource.data.indexOf(purchase);
      if (oldIndex !== -1) {
        const oldPurchase: PurchaseModel = this.purchasesDatasource.data[oldIndex];
        oldPurchase.paid = true;
        this.purchasesDatasource.data[oldIndex] = oldPurchase;
      }
    }).catch(reason => {
      console.log(reason);
      this.snack.open('Fails to record payments', 'Ok', {
        duration: 3000
      });
    });
  }
}
