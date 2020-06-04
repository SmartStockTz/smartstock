import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {CategoryI} from '../../../../model/CategoryI';
import {StockDatabaseService} from '../../../../services/stock-database.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DialogCategoryDeleteComponent, DialogCategoryNewComponent} from '../../../stocks/categories/categories.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  fetchCategoriesFlag = false;
  nameFormControl = new FormControl();
  descriptionFormControl = new FormControl();
  categories: Observable<CategoryI[]>;

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
      this.categories = of(data);
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
        // this.categoriesArray = this.categoriesArray.filter(value => value.objectId !== element.objectId);
        // this.categoriesDatasource = new MatTableDataSource<CategoryI>(this.categoriesArray);
        // this.snack.open('Category deleted', 'Ok', {
        //   duration: 2000
        // });
        this.getCategories();
      } else {
        this.snack.open('Category not deleted', 'Ok', {
          duration: 2000
        });
      }
    });
  }

  updateCategory(category) {
    this.dialog.open(DialogCategoryNewComponent, {
      minWidth: '80%',
      closeOnNavigation: true,
      hasBackdrop: true,
      data: category
    }).afterClosed().subscribe(value => {
      if (value) {
        this.getCategories();
      }
    });
  }

  openAddCategoryDialog() {
    this.dialog.open(DialogCategoryNewComponent, {
      minWidth: '80%',
      closeOnNavigation: true,
      hasBackdrop: true
    }).afterClosed().subscribe(value => {
      if (value) {
        // let prevData = [];
        // this.categories.subscribe(value1 => {
        //   prevData = value1;
        // });
        // prevData.push(value);
        // this.categories = of(prevData);
        this.getCategories();
      }
    });
  }
}
