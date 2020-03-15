import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-no-stock-dialog',
  templateUrl: './no-stock-dialog.component.html',
  styleUrls: ['./no-stock-dialog.component.css']
})
export class NoStockDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NoStockDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

}
