import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog-image-crop',
  templateUrl: './dialog-image-crop.component.html',
  styleUrls: ['./dialog-image-crop.component.css']
})
export class DialogImageCropComponent implements OnInit, OnDestroy {
  private croppedImage: string;
  loadImageFlag = true;
  fileEvent: any;

  constructor(private readonly  dialogRef: MatDialogRef<DialogImageCropComponent>,
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
