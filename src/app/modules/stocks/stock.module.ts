import {NgModule} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRippleModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ReactiveFormsModule} from '@angular/forms';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MatListModule} from '@angular/material/list';
import {RouterModule, Routes} from '@angular/router';
import {ViewPageComponent} from './pages/view.page';
import {StockDetailsComponent} from './components/stock.component';
import {TransferDialogComponent} from './components/transfer.component';
import {CreatePageComponent} from './pages/create.page';
import {EditPageComponent} from './pages/edit.page';
import {CategoriesComponent, DialogCategoryDeleteComponent, DialogCategoryNewComponent} from './components/categories.component';
import {DialogUnitDeleteComponent, DialogUnitNewComponent, UnitsComponent} from './components/units.component';
import {DialogSupplierDeleteComponent, DialogSupplierNewComponent, SuppliersComponent} from './components/suppliers.component';
import {ImportsDialogComponent} from './components/imports.component';
import {CommonModule} from '@angular/common';
import {LibModule} from '../lib/lib.module';

const routes: Routes = [
  {path: '', component: ViewPageComponent},
  {path: 'create', component: CreatePageComponent},
  {path: 'edit/:id', component: EditPageComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LibModule,
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
    MatListModule
  ],
  declarations: [
    ViewPageComponent,
    CreatePageComponent,
    EditPageComponent,
    CategoriesComponent,
    SuppliersComponent,
    UnitsComponent,
    StockDetailsComponent,
    DialogCategoryDeleteComponent,
    DialogCategoryNewComponent,
    DialogUnitDeleteComponent,
    DialogUnitNewComponent,
    DialogSupplierDeleteComponent,
    ImportsDialogComponent,
    TransferDialogComponent,
    DialogSupplierNewComponent,
  ],
})
export class StockModule {
}