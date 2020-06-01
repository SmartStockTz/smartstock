import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoryI} from '../../../model/CategoryI';
import {StockDatabaseService} from '../../../services/stock-database.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categoriesDatasource: MatTableDataSource<CategoryI>;
  categoriesTableColums = ['name', 'description', 'actions'];
  categoriesArray: CategoryI[];
  fetchCategoriesFlag = false;
  nameFormControl = new FormControl();
  descriptionFormControl = new FormControl();

  constructor(private readonly stockDatabase: StockDatabaseService,
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
  templateUrl: 'app-dialog-delete.html',

})
export class DialogCategoryDeleteComponent {
  deleteProgress = false;
  errorCategoryMessage: string;

  constructor(
    public dialogRef: MatDialogRef<DialogCategoryDeleteComponent>,
    private readonly stockDatabase: StockDatabaseService,
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
  templateUrl: 'app-new-category.html',

})
export class DialogCategoryNewComponent implements OnInit {
  newCategoryForm: FormGroup;
  createCategoryProgress = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly stockDatabase: StockDatabaseService,
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

