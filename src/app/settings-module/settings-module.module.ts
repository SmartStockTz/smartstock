import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SettingsModuleRoutingModule} from './settings-module-routing.module';
import {SettingComponent} from './setting/setting.component';
import {AccountComponent} from './account/account.component';
import {
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTooltipModule
} from '@angular/material';
import {CommonComponentsModule} from '../common-components/common-components.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    SettingComponent,
    AccountComponent
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
    ReactiveFormsModule
  ]
})
export class SettingsModuleModule {
}
