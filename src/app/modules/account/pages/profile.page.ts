import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {DeviceInfoUtil} from '../../lib/utils/device-info.util';

@Component({
  selector: 'smartstock-profile',
  template: `
    <mat-sidenav-container *ngIf="!isMobile" class="match-parent">
      <mat-sidenav class="match-parent-side"
                   [fixedInViewport]="true"
                   #sidenav
                   [mode]="enoughWidth()?'side':'over'"
                   [opened]="true">
        <smartstock-admin-drawer></smartstock-admin-drawer>
      </mat-sidenav>

      <mat-sidenav-content>
        <smartstock-toolbar [heading]=""
                     [sidenav]="sidenav"
                     [showProgress]="false">
        </smartstock-toolbar>

        <div class="container my-profile-wrapper">
          <mat-tab-group>
            <mat-tab label="Personal Information">
              <smartstock-profile-personal></smartstock-profile-personal>
            </mat-tab>
            <mat-tab label="Shop Information">
              <smartstock-profile-address></smartstock-profile-address>
            </mat-tab>
            <mat-tab label="Authentication">
              <smartstock-profile-authentication></smartstock-profile-authentication>
            </mat-tab>
          </mat-tab-group>
        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
    <smartstock-profile-mobile *ngIf="isMobile"></smartstock-profile-mobile>
  `,
  styleUrls: ['../style/profile.style.css']
})
export class ProfilePage extends DeviceInfoUtil implements OnInit {

  isMobile = environment.android;
  constructor() {
    super();
  }

  ngOnInit() {
  }

}
