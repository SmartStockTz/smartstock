import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
/** must be removed to common module **/
/** must be removed to common module **/
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {PurchasePageComponent} from './pages/purchase.page';
import {PurchaseDetailsComponent} from './components/details.component';
import {CreatePageComponent} from './pages/create.page';
import {LibModule} from '@smartstock/core-libs';


const routes: Routes = [
  {path: '', component: PurchasePageComponent},
  {path: 'create', component: CreatePageComponent}
];


@NgModule({
  declarations: [
    PurchasePageComponent,
    PurchaseDetailsComponent,
    CreatePageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSidenavModule,
    LibModule,
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
})
export class PurchasesModule {
}
