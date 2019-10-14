import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CheckUserProgressComponent} from './check-user-progress/check-user-progress.component';
import {NavComponent} from './nav/nav.component';
import {NavUserComponent} from './nav-user/nav-user.component';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatExpansionModule, MatIconModule,
  MatListModule, MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule, MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatExpansionModule,
    MatDividerModule,
    MatListModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  exports: [
    CheckUserProgressComponent,
    NavUserComponent,
    NavComponent,
    NavBarComponent
  ],
  declarations: [
    CheckUserProgressComponent,
    NavComponent,
    NavUserComponent,
    NavBarComponent
  ]
})
export class CommonComponentsModule {
}
