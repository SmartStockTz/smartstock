import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LandingPage} from './pages/landing.page';
import {FooterComponent} from './componets/footer.component';
import {PrivacyPageComponent} from './pages/privacy.page';
import {RouterModule, Routes} from '@angular/router';
import {BrowserPlatformGuard} from '../lib/services/browser-platform.guard';
import {MatDividerModule} from '@angular/material/divider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatSliderModule} from '@angular/material/slider';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';

const routes: Routes = [
  {
    path: '', canActivate: [BrowserPlatformGuard], component: LandingPage
  },
  {
    path: 'privacy', canActivate: [BrowserPlatformGuard], component: PrivacyPageComponent
  },
];

@NgModule({
  declarations: [
    LandingPage,
    FooterComponent,
    PrivacyPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDividerModule,
    FormsModule,
    MatCardModule,
    MatSliderModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
})
export class WebModule {
}
