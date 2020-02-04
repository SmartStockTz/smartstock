import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingComponent} from './setting/setting.component';
import {UsersComponent} from './users/users.component';
import {ProfileComponent} from './profile/profile.component';
import {BillingComponent} from './billing/billing.component';

const routes: Routes = [
  {path: 'general', component: SettingComponent},
  {path: 'bill', component: BillingComponent},
  {path: 'users', component: UsersComponent},
  {path: 'profile', component: ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsModuleRoutingModule {
}
