import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SalesLandingMobileComponent} from './sales/sales-landing-mobile.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {CommonComponentsModule} from '../shared/common-components.module';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import {RouterModule} from '@angular/router';
import {PurchaseMobileComponent} from './purchases/purchase-mobile/purchase-mobile.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatDividerModule} from '@angular/material/divider';
import {StockMobileComponent} from './stocks/stock-mobile.component';
import {StockProductsMobileUiComponent} from './stock-products-mobile-ui/stock-products-mobile-ui.component';
import {StockProductItemMobileUiComponent} from './stock-product-item-mobile-ui/stock-product-item-mobile-ui.component';
import {CategoriesMobileUiComponent} from './categories-mobile-ui/categories-mobile-ui.component';
import {SuppliersMobileUiComponent} from './suppliers-mobile-ui/suppliers-mobile-ui.component';
import {ShowSupplierMobileUiComponent} from './suppliers-mobile-ui/show-supplier-mobile-ui/show-supplier-mobile-ui.component';
import {UnitsMobileUiComponent} from './units-mobile-ui/units-mobile-ui.component';
import {SettingsComponent} from './settings/settings/settings.component';
import {SettingsGeneralComponent} from './settings/settings-general/settings-general.component';
import {BillingMobileComponent} from './settings/billing-mobile/billing-mobile.component';
import {MatRadioModule} from '@angular/material/radio';
import {UsersMobileComponent} from './settings/users-mobile/users-mobile.component';
import {ProfileMobileComponent} from './settings/profile-mobile/profile-mobile.component';
import {SharedWithMobileModule} from '../shared-with-mobile/shared-with-mobile.module';

@NgModule({
  declarations: [SalesLandingMobileComponent, PurchaseMobileComponent, StockMobileComponent, StockProductsMobileUiComponent,
    StockProductItemMobileUiComponent, CategoriesMobileUiComponent, SuppliersMobileUiComponent, ShowSupplierMobileUiComponent, UnitsMobileUiComponent,
    SettingsComponent, SettingsGeneralComponent, BillingMobileComponent, UsersMobileComponent, ProfileMobileComponent,
  ],
  exports: [
    SalesLandingMobileComponent,
    PurchaseMobileComponent,
    StockMobileComponent,
    StockProductsMobileUiComponent,
    CategoriesMobileUiComponent,
    SuppliersMobileUiComponent,
    SettingsComponent,
    SettingsGeneralComponent,
    BillingMobileComponent,
    UsersMobileComponent,
    ProfileMobileComponent,
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    CommonComponentsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    RouterModule,
    MatMenuModule,
    MatSidenavModule,
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
    ScrollingModule,
    MatListModule,
    MatRippleModule,
    MatRadioModule,
    SharedWithMobileModule
  ]
})
export class MobileUiModule {
}
