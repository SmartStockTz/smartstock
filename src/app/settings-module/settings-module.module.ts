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
  MatProgressSpinnerModule, MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import {CommonComponentsModule} from '../common-components/common-components.module';
import {ReactiveFormsModule} from '@angular/forms';
import {DialogUserDeleteComponent, DialogUserNewComponent, UsersComponent} from './users/users.component';
import {ProfileComponent} from './profile/profile.component';

@NgModule({
  declarations: [
    SettingComponent,
    AccountComponent,
    UsersComponent,
    ProfileComponent,
    DialogUserDeleteComponent,
    DialogUserNewComponent
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
    MatSelectModule
  ],
  entryComponents: [
    DialogUserNewComponent,
    DialogUserDeleteComponent,
  ]
})
export class SettingsModuleModule {
}
