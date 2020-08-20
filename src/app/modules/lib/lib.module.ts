import {NgModule} from '@angular/core';
import {DrawerComponent} from './components/drawer.component';
import {ToolbarComponent} from './components/toolbar.component';
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
import {NoStockDialogComponent} from './components/no-stock-dialog.component';
import {ImageCropComponent} from './components/image-crop.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {ShopsPipe} from './pipes/shops.pipe';
import {MatBadgeModule} from '@angular/material/badge';
import {OnFetchComponent} from './components/on-fetch.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SearchInputComponent} from './components/search-input.component';
import {BottomBarComponent} from './components/bottom-bar.component';
import {DataNotReadyComponent} from './components/data-not-ready.component';
import {UploadFilesComponent} from './upload-files/upload-files.component';
import {MatRippleModule} from '@angular/material/core';
import {DashCardComponent} from './components/dash-card.component';
import {CommonModule} from '@angular/common';


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
    MatBadgeModule,
    MatTooltipModule,
    MatRippleModule
  ],
  exports: [
    DrawerComponent,
    ToolbarComponent,
    ShopsPipe,
    OnFetchComponent,
    BottomBarComponent,
    DataNotReadyComponent,
    UploadFilesComponent,
    DashCardComponent
  ],
  declarations: [
    DrawerComponent,
    ToolbarComponent,
    NoStockDialogComponent,
    ImageCropComponent,
    ShopsPipe,
    OnFetchComponent,
    SearchInputComponent,
    BottomBarComponent,
    DataNotReadyComponent,
    UploadFilesComponent,
    DashCardComponent
  ],
  entryComponents: [
    ImageCropComponent
  ]
})
export class LibModule {
}
