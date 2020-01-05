import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CheckUserProgressComponent} from './check-user-progress/check-user-progress.component';
import {AdminDrawerComponent} from './admin-drawer/admin-drawer.component';
import {NavUserComponent} from './user-drawer/nav-user.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule, MatFormFieldModule, MatIconModule,
    MatListModule, MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule, MatToolbarModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

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
    RouterModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  exports: [
    CheckUserProgressComponent,
    NavUserComponent,
    AdminDrawerComponent,
    ToolbarComponent
  ],
  declarations: [
    CheckUserProgressComponent,
    AdminDrawerComponent,
    NavUserComponent,
    ToolbarComponent
  ]
})
export class CommonComponentsModule {
}
