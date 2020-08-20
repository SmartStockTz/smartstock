import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {CategoryI} from '../../../model/CategoryI';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DialogCategoryDeleteComponent, DialogCategoryNewComponent} from '../../stocks/components/categories.component';
import {StockState} from '../../stocks/states/stock.state';

@Component({
  selector: 'app-categories-mobile-ui',
  templateUrl: './categories-mobile-ui.component.html',
  styleUrls: ['./categories-mobile-ui.component.css']
})
export class CategoriesMobileUiComponent implements OnInit {

  fetchCategoriesFlag = false;
  nameFormControl = new FormControl();
  descriptionFormControl = new FormControl();
  categories: Observable<CategoryI[]>;

  constructor(private readonly stockDatabase: StockState,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly snack: MatSnackBar) {
  }

  ngOnInit() {
    this.getCategories();
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
        this.getCategories();
      }
    });
  }
}
