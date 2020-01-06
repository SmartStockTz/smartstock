import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger, MatSnackBar, MatTableDataSource} from '@angular/material';
import {CategoryI} from '../../model/CategoryI';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {StockDatabaseService} from '../../services/stock-database.service';

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

  updateCategory(category: any) {
    // this.snack.open('Update in progress..', 'Ok');
    // this.stockDatabase.updateCategory(category).then(data => {
    //   // console.log(data);
    //   this.categoriesArray = this.categoriesArray.filter(value => value.objectId !== category.objectId);
    //   this.categoriesArray.unshift(JSON.parse(JSON.stringify(data)));
    //   this.categoriesDatasource = new MatTableDataSource<any>(this.categoriesArray);
    //   this.snack.open('Category updated', 'Ok', {
    //     duration: 3000
    //   });
    // }).catch(reason => {
    //   this.snack.open(reason && reason.message ? reason.message : 'Fail to update category', 'Ok', {
    //     duration: 3000
    //   });
    // });
  }

  updateCategoryDescription(category, matMenu: MatMenuTrigger) {
    matMenu.toggleMenu();
    if (category && category.value) {
      category.field = 'description';
      this.updateCategory(category);
    }
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
export class DialogCategoryNewComponent {
  deleteProgress = false;
  errorCategoryMessage: string;
  newCategoryForm: FormGroup;
  createCategoryProgress = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly stockDatabase: StockDatabaseService,
    public dialogRef: MatDialogRef<DialogCategoryDeleteComponent>) {
  }

  createCategory() {
    this.createCategoryProgress = true;
    if (!this.newCategoryForm.valid) {
      this.snack.open('Please fll all details', 'Ok', {
        duration: 3000
      });
      return;
    }
    this.stockDatabase.addCategory(this.newCategoryForm.value).then(value => {
      this.createCategoryProgress = true;

    }).catch(reason => {
      this.createCategoryProgress = true;
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}

