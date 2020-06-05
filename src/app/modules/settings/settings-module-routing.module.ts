import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingComponent} from './setting/setting.component';
import {UsersComponent} from './users/users.component';
import {ProfileComponent} from './profile/profile.component';
import {BillingComponent} from './billing/billing.component';
import {StockManagerGuard} from '../../guards/stock-manager.guard';
import {SettingsComponent} from '../mobile-ui/settings/settings/settings.component';

const routes: Routes = [
  {path: '', component: SettingsComponent},
  {path: 'general', canActivate: [StockManagerGuard], component: SettingComponent},
  {path: 'bill', canActivate: [StockManagerGuard], component: BillingComponent},
  {path: 'users', canActivate: [StockManagerGuard], component: UsersComponent},
  {path: 'profile', component: ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsModuleRoutingModule {
}
