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
import {ProductsPage} from './pages/products.page';
import {StockDetailsComponent} from './components/stock.component';
import {TransferDialogComponent} from './components/transfer.component';
import {CreatePageComponent} from './pages/product-create.page';
import {EditPageComponent} from './pages/edit.page';
import {CategoriesComponent} from './components/categories.component';
import {DialogUnitDeleteComponent, DialogUnitNewComponent, UnitsComponent} from './components/units.component';
import {DialogSupplierDeleteComponent, DialogSupplierNewComponent, SuppliersComponent} from './components/suppliers.component';
import {ImportsDialogComponent} from './components/imports.component';
import {CommonModule} from '@angular/common';
import {LibModule} from '@smartstock/core-libs';
import {CategoryFormFieldComponent} from './components/category-form-field.component';
import {SuppliersFormFieldComponent} from './components/suppliers-form-field.component';
import {UnitsFormFieldComponent} from './components/units-form-field.component';
import {ProductShortDetailFormComponent} from './components/product-short-detail-form.component';
import {IndexPage} from './pages/index.page';
import {UnitsPage} from './pages/units.page';
import {SuppliersPage} from './pages/suppliers.page';
import {CategoriesPage} from './pages/categories.page';
import {CreateGroupProductsComponent} from './components/create-group-products.component';
import {CatalogFormFieldComponent} from './components/catalog-form-field.component';
import {DialogCategoryDeleteComponent} from './components/dialog-category-delete.component';
import {DialogCategoryCreateComponent} from './components/dialog-category-create.component';
import {DialogCatalogCreateComponent} from './components/dialog-catalog-create.component';
import {CatalogsComponent} from './components/catalogs.component';
import {DialogCatalogDeleteComponent} from './components/dialog-catalog-delete.component';
import {CatalogsPage} from './pages/catalogs.page';

const routes: Routes = [
  {path: '', component: IndexPage},
  {path: 'products', component: ProductsPage},
  {path: 'categories', component: CategoriesPage},
  {path: 'catalogs', component: CatalogsPage},
  {path: 'units', component: UnitsPage},
  {path: 'suppliers', component: SuppliersPage},
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
    CreateGroupProductsComponent,
    CatalogFormFieldComponent,
    IndexPage,
    CreatePageComponent,
    EditPageComponent,
    CategoriesComponent,
    SuppliersComponent,
    UnitsComponent,
    StockDetailsComponent,
    DialogCategoryDeleteComponent,
    DialogCategoryCreateComponent,
    DialogCatalogCreateComponent,
    DialogUnitDeleteComponent,
    DialogUnitNewComponent,
    DialogSupplierDeleteComponent,
    ImportsDialogComponent,
    TransferDialogComponent,
    DialogSupplierNewComponent,
    CategoryFormFieldComponent,
    SuppliersFormFieldComponent,
    UnitsFormFieldComponent,
    ProductShortDetailFormComponent,
    ProductShortDetailFormComponent,
    UnitsPage,
    SuppliersPage,
    CategoriesPage,
    ProductsPage,
    CatalogsComponent,
    DialogCatalogDeleteComponent,
    CatalogsPage
  ],
})
export class StockModule {
}
