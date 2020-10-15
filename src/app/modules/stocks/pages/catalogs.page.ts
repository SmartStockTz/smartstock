import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {DeviceInfoUtil} from '@smartstock/core-libs';


@Component({
  selector: 'smartstock-stock-catalogs',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side" [fixedInViewport]="true" #sidenav [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <smartstock-drawer></smartstock-drawer>
      </mat-sidenav>

      <mat-sidenav-content (swiperight)="openDrawer(sidenav)">

        <smartstock-toolbar [heading]="'Catalogs'" [showSearch]="false"
                            [searchPlaceholder]="'Type to search'"
                            [sidenav]="sidenav" [showProgress]="false">
        </smartstock-toolbar>

        <div>

          <div class="container">
            <div class="row" style="margin: 40px 0">
              <div class="full-width col-12">
                <smartstock-catalogs></smartstock-catalogs>
              </div>
            </div>
          </div>
        </div>

        <smartstock-bottom-bar *ngIf="isMobile && !enoughWidth()"></smartstock-bottom-bar>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/stock.style.css']
})
export class CatalogsPage extends DeviceInfoUtil implements OnInit, OnDestroy {
  isMobile = environment.android;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }
}




