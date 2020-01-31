import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DialogData } from 'src/app/sales-module/whole-sale/whole-sale.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DialogData {
  customer?: string;
  name?: string;
  type: number;
}

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.css']
})
export class CreateShopComponent implements OnInit {

  createShopForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<CreateShopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly snack: MatSnackBar,
    private readonly formBuilder: FormBuilder) { }

    onNoClick(): void {
      this.dialogRef.close();
    }

    createShop(){
      if(this.createShopForm.valid){
        console.log(this.createShopForm.value);
      }else{
        this.snack.open('please fill all required fields');
      }
    }
  ngOnInit() {
    this.createShopForm = this.formBuilder.group({
      businessName: ['',[Validators.nullValidator, Validators.required]],
      country: ['',[Validators.nullValidator, Validators.required]],
      region: ['',[Validators.nullValidator, Validators.required]],
      street: ['',[Validators.nullValidator, Validators.required]],
    })
  }

}
