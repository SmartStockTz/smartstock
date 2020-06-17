import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {LandingComponent} from './landing/landing.component';
import {DialogDeleteComponent} from '../modules/stocks/stock/stock.component';
import {RegisterComponent} from './register/register.component';
import {FooterComponent} from './landing/footer/footer.component';
import {CreateShopComponent} from './choose-shop/create-shop/create-shop.component';
import {PrivacyComponent} from './privacy/privacy.component';
import {ChooseShopComponent} from './choose-shop/choose-shop.component';
import {DialogSupplierNewComponent} from '../modules/stocks/suppliers/suppliers.component';
import {RegisterDialogComponent} from './register/rdialog.component';
import {VerifyEMailDialogComponent} from './login/verify-dialog.component';
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
import {RouterModule} from '@angular/router';
import {MatStepperModule} from '@angular/material/stepper';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {ResetPasswordDialogComponent} from './login/reset-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    LandingComponent,
    DialogDeleteComponent,
    RegisterComponent,
    FooterComponent,
    CreateShopComponent,
    PrivacyComponent,
    ChooseShopComponent,
    DialogSupplierNewComponent,
    RegisterDialogComponent,
    VerifyEMailDialogComponent,
    ResetPasswordDialogComponent
  ],
  imports: [
    CommonModule,
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
export class MainModuleModule {
}
