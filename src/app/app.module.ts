import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './login/login.component';
import {LandingComponent} from './landing/landing.component';
import {AppRoutingModule} from './app-routing.module';
import {environment} from '../environments/environment';
import {DialogDeleteComponent} from './stock-module/stock/stock.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgForageConfig} from 'ngforage';
import {DialogComponent} from './sales-module/whole-sale/whole-sale.component';
import {CommonComponentsModule} from './common-components/common-components.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {RegisterComponent} from './register/register.component';
import {NoStockDialogComponent} from './common-components/no-stock-dialog/no-stock-dialog.component';
import {FooterComponent} from './landing/footer/footer.component';
import {CreateShopComponent} from './choose-shop/create-shop/create-shop.component';
import {PrivancyComponent} from './privancy/privancy.component';
import {ChooseShopComponent} from './choose-shop/choose-shop.component';
import {DialogSupplierNewComponent} from './stock-module/suppliers/suppliers.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingComponent,
    DialogComponent,
    DialogDeleteComponent,
    RegisterComponent,
    FooterComponent,
    CreateShopComponent,
    PrivancyComponent,
    ChooseShopComponent,
    DialogSupplierNewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatDividerModule,
    MatGridListModule,
    MatInputModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    CommonComponentsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    MatStepperModule,
    MatTooltipModule,
    MatSliderModule,
  ],
  providers: [],
  entryComponents: [
    DialogComponent,
    DialogDeleteComponent,
    NoStockDialogComponent,
    DialogSupplierNewComponent,
    CreateShopComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  public constructor(ngfConfig: NgForageConfig) {
    ngfConfig.configure({
      name: 'ssm',
      size: 2000000000
    });
  }
}
