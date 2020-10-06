import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StockState} from '../states/stock.state';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'smartstock-new-catalog',
  template: `
    <div style="min-width: 300px">
      <div mat-dialog-title>Create Catalog</div>
      <div mat-dialog-content>
        <form class="d-flex flex-column" [formGroup]="newCatalogForm" (ngSubmit)="createCatalog()">

          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput type="text" formControlName="name" required>
            <mat-error>Name required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" [rows]="3"></textarea>
          </mat-form-field>

          <button color="primary" [disabled]="createCatalogProgress" mat-flat-button class="ft-button">
            Save
            <mat-progress-spinner style="display: inline-block" *ngIf="createCatalogProgress" [diameter]="20"
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
export class DialogCatalogCreateComponent implements OnInit {
  newCatalogForm: FormGroup;
  createCatalogProgress = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly stockDatabase: StockState,
    public dialogRef: MatDialogRef<DialogCatalogCreateComponent>) {
  }

  ngOnInit(): void {
    this.initiateForm();
  }

  initiateForm() {
    this.newCatalogForm = this.formBuilder.group({
      name: ['', [Validators.nullValidator, Validators.required]],
      description: ['']
    });
  }

  createCatalog() {
    if (!this.newCatalogForm.valid) {
      this.snack.open('Please fll all details', 'Ok', {
        duration: 3000
      });
      return;
    }

    this.createCatalogProgress = true;
    this.stockDatabase.addCatalog(this.newCatalogForm.value).then(value => {
      this.createCatalogProgress = false;
      value.name = this.newCatalogForm.value.name;
      value.description = this.newCatalogForm.value.description;
      this.dialogRef.close(value);
      this.snack.open('Catalog created', 'Ok', {
        duration: 3000
      });
    }).catch(_ => {
      this.createCatalogProgress = false;
      this.snack.open('Catalog not created, try again', 'Ok', {
        duration: 3000
      });
    });
  }

  cancel($event: Event) {
    $event.preventDefault();
    this.dialogRef.close(null);
  }
}
