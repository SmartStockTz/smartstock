import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {MatSliderModule} from '@angular/material/slider';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CommonComponentsModule} from './modules/shared/common-components.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {BFast} from 'bfastjs';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HttpClientModule} from '@angular/common/http';
import {MatNativeDateModule} from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonComponentsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    MatStepperModule,
    HttpClientModule,
    MatTooltipModule,
    MatSliderModule,
    MatSnackBarModule,
    RouterModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    BFast.init({
      applicationId: 'smartstock_lb', projectId: 'smartstock', cache: {
        enable: false
      }
    });

    // const evtSource = new EventSource('http://localhost:3000/tryEventFromBrowser');
    // evtSource.onmessage = function (event1: MessageEvent) {
    //   console.log(event1);
    // };
  }
}
