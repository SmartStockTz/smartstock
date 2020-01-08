import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SettingsModuleRoutingModule} from './settings-module-routing.module';
import {SettingComponent} from './setting/setting.component';
import {AccountComponent} from './account/account.component';

@NgModule({
  declarations: [
    SettingComponent,
    AccountComponent
  ],
  imports: [
    CommonModule,
    SettingsModuleRoutingModule
  ]
})
export class SettingsModuleModule {
}
