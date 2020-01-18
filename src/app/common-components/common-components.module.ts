import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CheckUserProgressComponent} from './check-user-progress/check-user-progress.component';
import {AdminDrawerComponent} from './admin-drawer/admin-drawer.component';
import {NavUserComponent} from './user-drawer/nav-user.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatToolbarModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {NoStockDialogComponent} from './no-stock-dialog/no-stock-dialog.component';

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
    MatDialogModule,
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
    ToolbarComponent,
    NoStockDialogComponent
  ]
})
export class CommonComponentsModule {
}
