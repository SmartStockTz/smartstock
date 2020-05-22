import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminDrawerComponent} from './admin-drawer/admin-drawer.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {NoStockDialogComponent} from './no-stock-dialog/no-stock-dialog.component';
import {DialogImageCropComponent} from './dialog-image-crop/dialog-image-crop.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {ShopsPipe} from './pipes/shops.pipe';
import { MatBadgeModule } from '@angular/material/badge';


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
    MatSelectModule,
    ImageCropperModule,
    MatBadgeModule
  ],
  exports: [
    AdminDrawerComponent,
    ToolbarComponent,
    ShopsPipe
  ],
  declarations: [
    AdminDrawerComponent,
    ToolbarComponent,
    NoStockDialogComponent,
    DialogImageCropComponent,
    ShopsPipe
      ],
  entryComponents: [
    DialogImageCropComponent
  ]
})
export class CommonComponentsModule {
}
