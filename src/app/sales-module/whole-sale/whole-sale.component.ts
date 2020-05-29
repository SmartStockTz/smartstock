import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-whole-sale',
  templateUrl: './whole-sale.component.html',
  styleUrls: ['./whole-sale.component.css'],
})
export class WholeSaleComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'app-dialog.html',
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      customer?: string;
      name?: string;
      type: number;
    }) {
  }

  done(ans: number) {
    this.dialogRef.close(ans);
  }
}
