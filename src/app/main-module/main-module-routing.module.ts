import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {LandingComponent} from './landing/landing.component';
import {PrivacyComponent} from './privacy/privacy.component';
import {AuthenticatedUserGuard} from '../guards/authenticated-user.guard';
import {AuthenticationGuard} from '../guards/authentication.guard';
import {ChooseShopComponent} from './choose-shop/choose-shop.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'login',
    canActivate: [AuthenticatedUserGuard],
    component: LoginComponent
  },
  {
    path: 'register',
    canActivate: [AuthenticatedUserGuard],
    component: RegisterComponent
  },
  {
    path: 'shop',
    canActivate: [AuthenticationGuard],
    component: ChooseShopComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseModuleRoutingModule {
}
