import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SettingsModuleRoutingModule} from './settings-module-routing.module';
import {SettingComponent} from './setting/setting.component';
import {AccountComponent} from './account/account.component';
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
import {CommonComponentsModule} from '../shared-components/common-components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  DialogUserDeleteComponent,
  DialogUserNewComponent,
  UpdateUserPasswordDialogComponent,
  UsersComponent
} from './users/users.component';
import {ProfileComponent} from './profile/profile.component';
import {BillingComponent} from './billing/billing.component';
import {ProfilePersonalComponent} from './profile-personal/profile-personal.component';
import {ProfileBusinessComponent} from './profile-business/profile-business.component';
import {ProfileAuthenticationComponent} from './profile-authentication/profile-authentication.component';
import {BillingInvoicesComponent} from './billing-invoices/billing-invoices.component';
import {BillingReceiptsComponent} from './billing-receipts/billing-receipts.component';

@NgModule({
  declarations: [
    SettingComponent,
    AccountComponent,
    UsersComponent,
    ProfileComponent,
    DialogUserDeleteComponent,
    DialogUserNewComponent,
    UpdateUserPasswordDialogComponent,
    BillingComponent,
    ProfilePersonalComponent,
    ProfileBusinessComponent,
    ProfileAuthenticationComponent,
    BillingInvoicesComponent,
    BillingReceiptsComponent
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
    MatSelectModule,
    MatRippleModule,
    MatDividerModule,
    MatRadioModule,
    FormsModule,
  ],
  entryComponents: [
    DialogUserNewComponent,
    DialogUserDeleteComponent,
    UpdateUserPasswordDialogComponent
  ]
})
export class SettingsModuleModule {
}
