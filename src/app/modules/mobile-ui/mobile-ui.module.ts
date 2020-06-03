import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesLandingMobileComponent } from './sales-landing-mobile/sales-landing-mobile.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {CommonComponentsModule} from '../shared/common-components.module';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import {RouterModule} from '@angular/router';
import { PurchaseMobileComponent } from './purchase-mobile-module/purchase-mobile/purchase-mobile.component';
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
import { StockMobileComponent } from './stock-mobile/stock-mobile.component';
import { StockProductsComponent } from './stock-mobile/stock-products/stock-products.component';
import { StockProductItemComponent } from './stock-mobile/stock-product-item/stock-product-item.component';


@NgModule({
  declarations: [SalesLandingMobileComponent, PurchaseMobileComponent, StockMobileComponent, StockProductsComponent, StockProductItemComponent],
  exports: [
    SalesLandingMobileComponent,
    PurchaseMobileComponent,
    StockMobileComponent,
    StockProductsComponent
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
  ]
})
export class MobileUiModule { }
