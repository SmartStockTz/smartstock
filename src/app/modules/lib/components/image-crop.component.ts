import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-image-crop',
  template: `
    <div>
      <mat-progress-spinner mode="indeterminate" color="primary"
                            [diameter]="20" *ngIf="loadImageFlag">
      </mat-progress-spinner>
      <span *ngIf="loadImageFlag">Load Image</span>
      <div>
        <image-cropper
          style="max-height: 60vh"
          [imageChangedEvent]="fileEvent"
          [maintainAspectRatio]="true"
          [aspectRatio]="16 / 9"
          [imageQuality]="70"
          [autoCrop]="true"
          [alignImage]="'center'"
          [onlyScaleDown]="true"
          format="png"
          (imageCropped)="imageCropped($event)"
          (imageLoaded)="imageLoaded()"
          (cropperReady)="cropperReady()"
          (loadImageFailed)="loadImageFailed()">
        </image-cropper>
      </div>
      <div *ngIf="!loadImageFlag" style="padding: 16px">
        <button color="primary" (click)="closeDialog()" mat-button class="btn-block">Done</button>
      </div>
    </div>
  `,
  styleUrls: ['../styles/image-crop.style.css']
})
export class ImageCropComponent implements OnInit, OnDestroy {
  private croppedImage: string;
  loadImageFlag = true;
  fileEvent: any;

  constructor(private readonly  dialogRef: MatDialogRef<ImageCropComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { event: any }) {
  }

  ngOnInit() {
    this.fileEvent = null;
    this.fileEvent = this.data.event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.loadImageFlag = false;
    // console.log('image loaded');
  }

  cropperReady() {
    // cropper ready
    // console.log('crop ready');
  }

  loadImageFailed() {
    // show message
    // console.log('crop fail');
  }

  closeDialog() {
    this.dialogRef.close(this.croppedImage);
  }

  ngOnDestroy(): void {
    this.fileEvent = null;
  }
}
