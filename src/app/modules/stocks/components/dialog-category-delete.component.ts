import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StockState} from '../states/stock.state';

@Component({
  selector: 'smartstock-dialog-delete',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <mat-panel-title class="text-center">
            Your about to delete : <b>{{' ' + data.name}}</b>
          </mat-panel-title>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <div class="align-self-center" style="margin: 8px">
          <button [disabled]="deleteProgress" color="primary" mat-button (click)="deleteCategory(data)">
            Delete
            <mat-progress-spinner *ngIf="deleteProgress"
                                  matTooltip="Delete in progress..."
                                  style="display: inline-block" mode="indeterminate" diameter="15"
                                  color="accent"></mat-progress-spinner>
          </button>
        </div>
        <div class="alert-secondary" style="margin: 8px">
          <button [disabled]="deleteProgress" color="primary" mat-button (click)="cancel()">Cancel</button>
        </div>
      </div>
      <p class="bg-danger" *ngIf="errorCategoryMessage">{{errorCategoryMessage}}</p>
    </div>
  `
})
export class DialogCategoryDeleteComponent {
  deleteProgress = false;
  errorCategoryMessage: string;

  constructor(
    public dialogRef: MatDialogRef<DialogCategoryDeleteComponent>,
    private readonly stockDatabase: StockState,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  deleteCategory(category: any) {
    this.errorCategoryMessage = undefined;
    this.deleteProgress = true;
    this.stockDatabase.deleteCategory(category).then(value => {
      this.dialogRef.close(category);
      this.deleteProgress = false;
    }).catch(reason => {
      this.errorCategoryMessage = reason && reason.message ? reason.message : reason.toString();
      this.deleteProgress = false;
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
