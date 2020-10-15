import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CartComponent} from './components/cart.component';
import {ProductComponent} from './components/product.component';
import {RetailPageComponent} from './pages/retail.page';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatRippleModule} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {SaleComponent} from './components/sale.component';
import {CartPreviewComponent} from './components/cart-preview.component';
import {RouterModule, Routes} from '@angular/router';
import {WholePageComponent} from './pages/whole.page';
import {LibModule} from '@smartstock/core-libs';
import {IndexPage} from './pages/index.page';
import {OrderPage} from './pages/order.page';
import {OrdersTableComponent} from './components/orders-table.component';
import {CdkTableModule} from '@angular/cdk/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
import {OrdersTableActionsComponent} from './components/orders-table-actions.component';
import {OrderPaymentStatusComponent} from './components/order-payment-status.component';
import {OrdersTableOptionsComponent} from './components/orders-table-options.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {OrdersTableShowItemsComponent} from './components/orders-table-show-items.component';


const routes: Routes = [
  {path: '', component: IndexPage},
  {path: 'order', component: OrderPage},
  {path: 'whole', component: WholePageComponent},
  {path: 'retail', component: RetailPageComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LibModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatSortModule,
    MatTooltipModule,
    MatToolbarModule,
    MatBadgeModule,
    MatRippleModule,
    MatListModule,
    ScrollingModule,
    FormsModule,
    CdkTableModule,
    MatProgressBarModule,
    MatChipsModule,
    MatBottomSheetModule
  ],
  declarations: [
    OrdersTableShowItemsComponent,
    OrdersTableOptionsComponent,
    OrderPaymentStatusComponent,
    OrdersTableActionsComponent,
    IndexPage,
    OrderPage,
    OrdersTableComponent,
    WholePageComponent,
    CartComponent,
    ProductComponent,
    RetailPageComponent,
    SaleComponent,
    CartPreviewComponent
  ],
})
export class SalesModule {
}
