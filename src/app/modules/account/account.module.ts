import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsPage} from './pages/settings.page';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProfilePage} from './pages/profile.page';
import {BillingPage} from './pages/billing.page';
import {MobilePayDetailsComponent} from './components/mobile-pay-details.component';
import {MatListModule} from '@angular/material/list';
import {RouterModule, Routes} from '@angular/router';
import {KeeperGuard} from '../stocks/guards/keeper.guard';
import {LibModule} from '@smartstock/core-libs';
import {LoginPage} from './pages/login.page';
import {RegisterPage} from './pages/register.page';
import {AuthenticationGuard} from './guards/authentication.guard';
import {ShopPage} from './pages/shop.page';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {PersonalComponent} from './components/personal.component';
import {AddressComponent} from './components/address.component';
import {AuthenticationComponent} from './components/credentials.component';
import {ReceiptsComponent} from './components/receipt.component';
import {InvoicesComponent} from './components/invoice.component';
import {UserDeleteDialogComponent} from './components/user-delete-dialog.component';
import {UserCreateDialogComponent} from './components/user-create-dialog.component';
import {UserUpdateDialogComponent} from './components/user-update-dialog.component';
import {UsersPage} from './pages/users.page';
import {AuthenticatedUserGuard} from './guards/authenticated-user.guard';
import {ActiveShopGuard} from './guards/active-shop.guard';
import {PersonalDetailsFormComponent} from './components/personal-details-form.component';
import {BusinessDetailsFormComponent} from './components/business-details-form.component';
import {MatStepperModule} from '@angular/material/stepper';
import {CreateShopDialogComponent} from './components/create-shop-dialog.component';
import {VerifyEMailDialogComponent} from './components/verify-dialog.component';
import {ResetPasswordDialogComponent} from './components/reset-password.component';
import {RegisterDialogComponent} from './components/register-dialog.component';
import {LoginDetailsFormComponent} from './components/login-details-form.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';


const routes: Routes = [
  {path: '', redirectTo: 'profile', pathMatch: 'full'},
  {path: 'settings', canActivate: [KeeperGuard, ActiveShopGuard], component: SettingsPage},
  {path: 'shop', canActivate: [AuthenticationGuard], component: ShopPage},
  {path: 'login', canActivate: [AuthenticatedUserGuard], component: LoginPage},
  {path: 'register', canActivate: [AuthenticatedUserGuard], component: RegisterPage},
  {path: 'bill', canActivate: [KeeperGuard, ActiveShopGuard], component: BillingPage},
  {path: 'users', canActivate: [KeeperGuard, ActiveShopGuard], component: UsersPage},
  {path: 'profile', canActivate: [AuthenticationGuard, ActiveShopGuard], component: ProfilePage},
];

@NgModule({
  declarations: [
    SettingsPage,
    UsersPage,
    ProfilePage,
    BillingPage,
    PersonalComponent,
    AddressComponent,
    AuthenticationComponent,
    MobilePayDetailsComponent,
    ReceiptsComponent,
    InvoicesComponent,
    UserDeleteDialogComponent,
    UserCreateDialogComponent,
    UserUpdateDialogComponent,
    PersonalDetailsFormComponent,
    BusinessDetailsFormComponent,
    RegisterPage,
    LoginPage,
    CreateShopDialogComponent,
    ShopPage,
    VerifyEMailDialogComponent,
    ResetPasswordDialogComponent,
    RegisterDialogComponent,
    LoginDetailsFormComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSidenavModule,
    LibModule,
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
    MatRippleModule,
    MatDividerModule,
    MatRadioModule,
    FormsModule,
    MatListModule,
    MatBottomSheetModule,
    MatStepperModule,
    MatToolbarModule,
    MatProgressBarModule,
  ]
})
export class AccountModule {
}
