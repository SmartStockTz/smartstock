import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginPage} from '../account/pages/login.page';
import {LandingPage} from './pages/landing.page';
import {RegisterPage} from '../account/pages/register.page';
import {FooterComponent} from './componets/footer.component';
import {CreateShopDialogComponent} from '../account/components/create-shop-dialog.component';
import {PrivacyPageComponent} from './pages/privacy.page';
import {ShopPage} from '../account/pages/shop.page';
import {RegisterDialogComponent} from '../account/components/register-dialog.component';
import {VerifyEMailDialogComponent} from '../account/components/verify-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatRippleModule} from '@angular/material/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSliderModule} from '@angular/material/slider';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterModule, Routes} from '@angular/router';
import {MatStepperModule} from '@angular/material/stepper';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {ResetPasswordDialogComponent} from '../account/components/reset-password.component';
import {DialogSupplierNewComponent} from '../stocks/components/suppliers.component';
import {DialogDeleteComponent} from '../stocks/components/stock.component';
import {BrowserPlatformGuard} from '../lib/services/browser-platform.guard';

const routes: Routes = [
  {
    path: '', canActivate: [BrowserPlatformGuard], component: LandingPage
  },
  {
    path: 'privacy', canActivate: [BrowserPlatformGuard], component: PrivacyPageComponent
  },
];

@NgModule({
  declarations: [
    LoginPage,
    LandingPage,
    DialogDeleteComponent,
    RegisterPage,
    FooterComponent,
    CreateShopDialogComponent,
    PrivacyPageComponent,
    ShopPage,
    DialogSupplierNewComponent,
    RegisterDialogComponent,
    VerifyEMailDialogComponent,
    ResetPasswordDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTooltipModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatSliderModule,
    FormsModule,
    MatDividerModule,
    MatProgressBarModule,
    MatDialogModule,
    RouterModule,
    MatStepperModule,
    MatToolbarModule,
    MatExpansionModule,
  ],
})
export class WebModule {
}
