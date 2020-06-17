import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {Stock} from '../../../model/stock';

@Component({
  selector: 'app-stock-edit',
  templateUrl: './stock-edit.component.html',
  styleUrls: ['./stock-edit.component.css']
})
export class StockEditComponent extends DeviceInfo implements OnInit {

  updateForm: FormGroup;
  mainProgress = false;
  stock: Stock;
  loadStock = false;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly snack: MatSnackBar) {
    super();
  }

  ngOnInit() {
    this.getStock();
  }

  getStock() {
    this.loadStock = true;
    this.activatedRoute.queryParams.subscribe(value => {
      if (value && value.stock) {
        this.loadStock = false;
        this.stock = JSON.parse(value.stock);
      } else {
        this.loadStock = false;
        this.snack.open('Fails to get stock for update', 'Ok', {
          duration: 3000
        });
      }
    });
  }
}
