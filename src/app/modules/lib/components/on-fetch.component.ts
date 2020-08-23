import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'smartstock-on-fetch',
  template: `
    <div *ngIf="!isLoading" class="no-data-wrapper">
      <img src="/src/assets/img/empty.svg" width="200px" alt="">
      <h4>No Data</h4>
      <button (click)="callBack()" matTooltip="Click to refresh" mat-raised-button mat-icon-button>
        <mat-icon color="accent">
          refresh
        </mat-icon>
      </button>
    </div>

    <div *ngIf="isLoading" class="no-data-wrapper">
      <img src="/src/assets/img/data.svg" width="200px" alt="">
      <h4>Fetching data...</h4>
      <mat-progress-spinner color="accent" mode="indeterminate" [diameter]="30"></mat-progress-spinner>
    </div>
  `,
  styleUrls: ['../styles/on-fetch.style.css']
})
export class OnFetchComponent implements OnInit {

  @Output() refreshCallback = new EventEmitter();
  @Input() isLoading: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  callBack() {
    this.refreshCallback.emit();
  }

}
