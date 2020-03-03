import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './login/login.component';
import {LandingComponent} from './landing/landing.component';
import {AppRoutingModule} from './app-routing.module';
import {environment} from '../environments/environment';
import {DialogDeleteComponent} from './stock-module/stock/stock.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgForageConfig} from 'ngforage';
import {DialogComponent} from './sales-module/whole-sale/whole-sale.component';
import {CommonComponentsModule} from './common-components/common-components.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {RegisterComponent} from './register/register.component';
import {NoStockDialogComponent} from './common-components/no-stock-dialog/no-stock-dialog.component';
import { FooterComponent } from './landing/footer/footer.component';
import {MatCarouselModule} from '@ngmodule/material-carousel';
import { CreateShopComponent } from './choose-shop/create-shop/create-shop.component';
import { PrivancyComponent } from './privancy/privancy.component';

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
    PrivancyComponent
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
    MatCarouselModule,
  ],
  providers: [],
  entryComponents: [
    DialogComponent,
    DialogDeleteComponent,
    NoStockDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  public constructor(ngfConfig: NgForageConfig) {
    ngfConfig.configure({
      name: 'ssm',
    });
  }
}
