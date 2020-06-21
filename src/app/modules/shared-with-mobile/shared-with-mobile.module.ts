import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileAuthenticationComponent} from './profile-authentication/profile-authentication.component';
import {ProfileBusinessComponent} from './profile-business/profile-business.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {CommonComponentsModule} from '../shared/common-components.module';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatRippleModule} from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatRadioModule} from '@angular/material/radio';
import {ProfilePersonalComponent} from './profile-personal/profile-personal.component';
import {BillingInvoicesComponent} from './billing-invoices/billing-invoices.component';
import {BillingReceiptsComponent} from './billing-receipts/billing-receipts.component';
import {MatListModule} from '@angular/material/list';

@NgModule({
  declarations: [ProfileAuthenticationComponent,
    ProfileBusinessComponent,
    ProfilePersonalComponent,
    BillingInvoicesComponent,
    BillingReceiptsComponent
  ],
    imports: [
        CommonModule,
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
        MatListModule,
    ],
  exports: [
    ProfileAuthenticationComponent,
    ProfileBusinessComponent,
    ProfilePersonalComponent,
    BillingInvoicesComponent,
    BillingReceiptsComponent
  ],
})
export class SharedWithMobileModule { }
