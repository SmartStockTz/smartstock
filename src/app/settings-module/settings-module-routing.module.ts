import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingComponent} from './setting/setting.component';
import {AccountComponent} from './account/account.component';


const routes: Routes = [
  {path: 'general', component: SettingComponent},
  {path: 'account', component: AccountComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsModuleRoutingModule {
}
