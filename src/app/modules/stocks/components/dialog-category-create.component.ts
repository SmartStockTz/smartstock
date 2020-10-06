import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StockState} from '../states/stock.state';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogCategoryDeleteComponent} from './dialog-category-delete.component';

@Component({
  selector: 'smartstock-new-category',
  template: `
    <div style="min-width: 300px">
      <div mat-dialog-title>Create Category</div>
      <div mat-dialog-content>
        <form class="d-flex flex-column" [formGroup]="newCategoryForm" (ngSubmit)="createCategory()">

          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput type="text" formControlName="name" required>
            <mat-error>Name required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" [rows]="3"></textarea>
          </mat-form-field>

          <button color="primary" [disabled]="createCategoryProgress" mat-flat-button class="ft-button">
            Save
            <mat-progress-spinner style="display: inline-block" *ngIf="createCategoryProgress" [diameter]="20"
                                  mode="indeterminate"></mat-progress-spinner>
          </button>
          <span style="margin-bottom: 8px"></span>
          <button color="warn" mat-dialog-close mat-button (click)="cancel($event)">
            Close
          </button>
        </form>
      </div>
    </div>
  `
})
export class DialogCategoryCreateComponent implements OnInit {
  newCategoryForm: FormGroup;
  createCategoryProgress = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly stockDatabase: StockState,
    public dialogRef: MatDialogRef<DialogCategoryDeleteComponent>) {
  }

  ngOnInit(): void {
    this.initiateForm();
  }

  initiateForm() {
    this.newCategoryForm = this.formBuilder.group({
      name: ['', [Validators.nullValidator, Validators.required]],
      description: ['']
    });
  }

  createCategory() {
    if (!this.newCategoryForm.valid) {
      this.snack.open('Please fll all details', 'Ok', {
        duration: 3000
      });
      return;
    }

    this.createCategoryProgress = true;
    this.stockDatabase.addCategory(this.newCategoryForm.value).then(value => {
      this.createCategoryProgress = false;
      value.name = this.newCategoryForm.value.name;
      value.description = this.newCategoryForm.value.description;
      this.dialogRef.close(value);
      this.snack.open('Category created', 'Ok', {
        duration: 3000
      });
    }).catch(reason => {
      console.log(reason);
      this.createCategoryProgress = false;
      //  this.dialogRef.close(null);
      this.snack.open('Category not created, try again', 'Ok', {
        duration: 3000
      });
    });
  }

  cancel($event: Event) {
    $event.preventDefault();
    this.dialogRef.close(null);
  }
}
