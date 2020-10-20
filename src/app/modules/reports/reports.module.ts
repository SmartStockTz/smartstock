import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {StockPageComponent} from './pages/stock.page';
import {ReorderComponent} from './components/reorder.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {DashboardModule} from '../dashboard/dashboard.module';
import {MatMenuModule} from '@angular/material/menu';
import {SalesPageComponent} from './pages/sales.page';
import {ExpireNearComponent} from './components/expireNear.component';
import {CartComponent} from './components/cart.component';
import {ExpiredComponent} from './components/expired.component';
import {ProfitByCategoryComponent} from './components/profit-by-category.component';
import {RouterModule, Routes} from '@angular/router';
import {LibModule} from '@smartstocktz/core-libs';


const routes: Routes = [
  {path: '', redirectTo: 'sales', pathMatch: 'full'},
  {path: 'sales', component: SalesPageComponent},
  {path: 'stocks', component: StockPageComponent},
];

@NgModule({
  declarations: [
    ExpiredComponent,
    StockPageComponent,
    ReorderComponent,
    ExpireNearComponent,
    CartComponent,
    SalesPageComponent,
    ProfitByCategoryComponent
  ],
  exports: [
    ExpiredComponent,
    StockPageComponent,
    ReorderComponent,
    ExpireNearComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatDatepickerModule,
        LibModule,
        MatSidenavModule,
        MatCardModule,
        MatFormFieldModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatSelectModule,
        MatDividerModule,
        MatInputModule,
        MatMenuModule,
        DashboardModule,
        MatRippleModule,
        LibModule
    ]
})
export class ReportsModule {
}
