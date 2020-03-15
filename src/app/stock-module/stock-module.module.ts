import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StockModuleRoutingModule} from './stock-module-routing.module';
import {StockComponent, StockDetailsComponent} from './stock/stock.component';
import {CommonComponentsModule} from '../common-components/common-components.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {ReactiveFormsModule} from '@angular/forms';
import {StockNewComponent} from './stock-new/stock-new.component';
import {StockEditComponent} from './stock-edit/stock-edit.component';
import {CategoriesComponent, DialogCategoryDeleteComponent, DialogCategoryNewComponent} from './categories/categories.component';
import {DialogSupplierDeleteComponent, SuppliersComponent} from './suppliers/suppliers.component';
import {DialogUnitDeleteComponent, DialogUnitNewComponent, UnitsComponent} from './units/units.component';
import {ImageCropperModule} from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    StockModuleRoutingModule,
    CommonComponentsModule,
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule,
    MatRippleModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatExpansionModule,
    MatDialogModule,
    ImageCropperModule,
  ],
  declarations: [
    StockComponent,
    StockNewComponent,
    StockEditComponent,
    CategoriesComponent,
    SuppliersComponent,
    UnitsComponent,
    StockDetailsComponent,
    DialogCategoryDeleteComponent,
    DialogCategoryNewComponent,
    DialogUnitDeleteComponent,
    DialogUnitNewComponent,
    DialogSupplierDeleteComponent
  ],
  entryComponents: [
    StockDetailsComponent,
    DialogCategoryDeleteComponent,
    DialogCategoryNewComponent,
    DialogUnitDeleteComponent,
    DialogUnitNewComponent,
    DialogSupplierDeleteComponent
  ]
})
export class StockModuleModule {
}
