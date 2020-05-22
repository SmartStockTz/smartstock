import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PurchaseModuleRoutingModule} from './purchase-module-routing.module';
import {PurchaseComponent, PurchaseDetailsComponent} from './purchase/purchase.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {CommonComponentsModule} from '../shared-components/common-components.module';
import {ReactiveFormsModule} from '@angular/forms';
import {PurchaseCreateComponent} from './purchase-create/purchase-create.component';


@NgModule({
  declarations: [
    PurchaseComponent,
    PurchaseDetailsComponent,
    PurchaseCreateComponent
  ],
  imports: [
    CommonModule,
    PurchaseModuleRoutingModule,
    MatSidenavModule,
    CommonComponentsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatSelectModule,
  ],
  entryComponents: [
    PurchaseDetailsComponent,
  ]
})
export class PurchaseModuleModule {
}
