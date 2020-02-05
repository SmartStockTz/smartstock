import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SettingsModuleRoutingModule} from './settings-module-routing.module';
import {SettingComponent} from './setting/setting.component';
import {AccountComponent} from './account/account.component';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import {CommonComponentsModule} from '../common-components/common-components.module';
import {ReactiveFormsModule} from '@angular/forms';
import {
  DialogUserDeleteComponent,
  DialogUserNewComponent,
  UpdateUserPasswordDialogComponent,
  UsersComponent
} from './users/users.component';
import {ProfileComponent} from './profile/profile.component';
import { BillingComponent } from './billing/billing.component';
import { ProfilePersonalComponent } from './profile-personal/profile-personal.component';
import { ProfileAddressComponent } from './profile-address/profile-address.component';
import { ProfileAuthenticationComponent } from './profile-authentication/profile-authentication.component';

@NgModule({
  declarations: [
    SettingComponent,
    AccountComponent,
    UsersComponent,
    ProfileComponent,
    DialogUserDeleteComponent,
    DialogUserNewComponent,
    UpdateUserPasswordDialogComponent,
    BillingComponent,
    ProfilePersonalComponent,
    ProfileAddressComponent,
    ProfileAuthenticationComponent
  ],
  imports: [
    CommonModule,
    SettingsModuleRoutingModule,
    MatSidenavModule,
    CommonComponentsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatExpansionModule,
    MatDialogModule,
    MatSelectModule,
    MatRippleModule
  ],
  entryComponents: [
    DialogUserNewComponent,
    DialogUserDeleteComponent,
    UpdateUserPasswordDialogComponent
  ]
})
export class SettingsModuleModule {
}
