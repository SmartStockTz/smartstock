import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'smartstock-upload-file-progress',
  template: `
    <div *ngIf="onUploadFlag">
      <mat-progress-bar [bufferValue]="100" mode="determinate" [value]="uploadPercentage"></mat-progress-bar>
      <span>{{name}} {{uploadPercentage}}%</span>
    </div>
  `,
})
export class UploadFileProgressComponent implements OnInit {
  @Input() name = '';
  @Input() onUploadFlag = false;
  @Input() uploadPercentage = 0;

  constructor() {
  }

  ngOnInit(): void {
  }
}
