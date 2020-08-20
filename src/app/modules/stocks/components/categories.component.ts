import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoryI} from '../../../model/CategoryI';
import {StockState} from '../states/stock.state';

@Component({
  selector: 'app-categories',
  template: `
    <mat-card class="mat-elevation-z0">
      <mat-card-title class="d-flex flex-row">
        <button (click)="openAddCategoryDialog()" color="primary" class="ft-button" mat-flat-button>
          Add Category
        </button>
        <span class="toolbar-spacer"></span>
        <button [matMenuTriggerFor]="menuCategories" mat-icon-button>
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menuCategories>
          <button (click)="getCategories()" mat-menu-item>Reload Categories</button>
        </mat-menu>
      </mat-card-title>
      <mat-card-content>
        <table style="margin-top: 16px" class="my-input"
               *ngIf="!fetchCategoriesFlag && categoriesArray && categoriesArray.length > 0"
               mat-table
               [dataSource]="categoriesDatasource">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td class="editable" [matMenuTriggerFor]="nameMenu"
                #nameMenuTrigger="matMenuTrigger"
                [matMenuTriggerData]="{objectId: element.objectId, data: element.name}" matRipple mat-cell
                *matCellDef="let element">{{element.name}}
              <mat-menu #nameMenu>
                <ng-template matMenuContent let-objectId="objectId" let-data="data">
                  <div (click)="$event.stopPropagation()" style="padding: 16px">
                    <mat-form-field class="my-input" appearance="outline">
                      <mat-label>Name</mat-label>
                      <input [value]="data" [formControl]="nameFormControl" matInput>
                    </mat-form-field>
                    <button
                      (click)="updateCategoryName({objectId: objectId, value: nameFormControl.value}, nameMenuTrigger)"
                      mat-button>Update
                    </button>
                  </div>
                </ng-template>
              </mat-menu>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td class="editable" [matMenuTriggerFor]="descriptionMenu"
                #descriptionMenuTrigger="matMenuTrigger"
                [matMenuTriggerData]="{objectId: element.objectId, data: element.description}" matRipple mat-cell
                *matCellDef="let element">{{element.description}}
              <mat-menu #descriptionMenu>
                <ng-template style="padding: 16px" matMenuContent let-objectId="objectId" let-data="data">
                  <div (click)="$event.stopPropagation()" style="padding: 16px">
                    <mat-form-field class="my-input" appearance="outline">
                      <mat-label>Description</mat-label>
                      <textarea [value]="data" [formControl]="descriptionFormControl" matInput></textarea>
                    </mat-form-field>
                    <button
                      (click)="updateCategoryDescription({objectId: objectId, value: descriptionFormControl.value},
                     descriptionMenuTrigger)"
                      mat-button>Update
                    </button>
                  </div>
                </ng-template>
              </mat-menu>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>
              <div class="d-flex justify-content-end align-items-end">
                Actions
              </div>
            </th>
            <td mat-cell *matCellDef="let element">
              <div class="d-flex justify-content-end align-items-end">
                <button [matMenuTriggerFor]="opts" color="primary" mat-icon-button>
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #opts>
                  <button (click)="deleteCategory(element)" mat-menu-item>
                    Delete
                  </button>
                </mat-menu>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="categoriesTableColums"></tr>
          <tr mat-row class="table-data-row" *matRowDef="let row; columns: categoriesTableColums;"></tr>
        </table>
        <div *ngIf="fetchCategoriesFlag">
          <mat-progress-spinner matTooltip="fetch categories" [diameter]="30" mode="indeterminate"
                                color="primary"></mat-progress-spinner>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['../styles/categories.style.css']
})
export class CategoriesComponent implements OnInit {

  categoriesDatasource: MatTableDataSource<CategoryI>;
  categoriesTableColums = ['name', 'description', 'actions'];
  categoriesArray: CategoryI[];
  fetchCategoriesFlag = false;
  nameFormControl = new FormControl();
  descriptionFormControl = new FormControl();

  constructor(private readonly stockDatabase: StockState,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly snack: MatSnackBar) {
  }

  ngOnInit() {
    this.getCategories();
  }

  searchCategory(query: string) {
    // if ($event && $event.query) {
    //   this.fetchCategoriesFlag = true;
    //   this.stockDatabase.searchCategory($event.query, {size: 20}).then(data => {
    //     this.categoriesArray = JSON.parse(JSON.stringify(data));
    //     // this.skip +=this.productsArray.length;
    //     this.categoriesDatasource = new MatTableDataSource(this.categoriesArray);
    //     this.fetchCategoriesFlag = false;
    //     // this.size = 0;
    //   }).catch(reason => {
    //     this.snack.open(reason, 'Ok', {
    //       duration: 3000
    //     });
    //     this.fetchCategoriesFlag = false;
    //   });
    // } else {
    //   this.getCategories();
    // }
  }

  getCategories() {
    this.fetchCategoriesFlag = true;
    this.stockDatabase.getAllCategory({size: 100}).then(data => {
      this.categoriesArray = JSON.parse(JSON.stringify(data));
      this.categoriesDatasource = new MatTableDataSource<CategoryI>(this.categoriesArray);
      this.fetchCategoriesFlag = false;
    }).catch(reason => {
      console.log(reason);
      this.fetchCategoriesFlag = false;
    });
  }

  deleteCategory(element: any) {
    this.dialog.open(DialogCategoryDeleteComponent, {
      data: element,
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.categoriesArray = this.categoriesArray.filter(value => value.objectId !== element.objectId);
        this.categoriesDatasource = new MatTableDataSource<CategoryI>(this.categoriesArray);
        this.snack.open('Category deleted', 'Ok', {
          duration: 2000
        });
      } else {
        this.snack.open('Category not deleted', 'Ok', {
          duration: 2000
        });
      }
    });
  }

  updateCategoryName(category, matMenu: MatMenuTrigger) {
    matMenu.toggleMenu();
    if (category && category.value) {
      category.field = 'name';
      this.updateCategory(category);
    }
  }

  updateCategory(category: { objectId: string, value: string, field: string }) {
    this.snack.open('Update in progress..', 'Ok');
    this.stockDatabase.updateCategory(category).then(data => {
      const editedObjectIndex = this.categoriesArray.findIndex(value => value.objectId === data.objectId);
      this.categoriesArray = this.categoriesArray.filter(value => value.objectId !== category.objectId);
      if (editedObjectIndex !== -1) {
        const updatedObject = this.categoriesArray[editedObjectIndex];
        updatedObject[category.field] = category.value;
        this.categoriesDatasource.data[editedObjectIndex] = updatedObject;
      } else {
        console.warn('fails to update category table');
      }
      this.snack.open('Category updated', 'Ok', {
        duration: 3000
      });
    }).catch(reason => {
      this.snack.open(reason && reason.message ? reason.message : 'Fail to update category', 'Ok', {
        duration: 3000
      });
    });
  }

  updateCategoryDescription(category, matMenu: MatMenuTrigger) {
    matMenu.toggleMenu();
    if (category && category.value) {
      category.field = 'description';
      this.updateCategory(category);
    }
  }

  openAddCategoryDialog() {
    this.dialog.open(DialogCategoryNewComponent, {
      closeOnNavigation: true,
      hasBackdrop: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.categoriesArray.push(value);
        this.categoriesDatasource.data = this.categoriesArray;
      }
    });
  }
}

@Component({
  selector: 'app-dialog-delete',
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


@Component({
  selector: 'app-new-category',
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
export class DialogCategoryNewComponent implements OnInit {
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

