import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateShopComponent } from './create-shop/create-shop.component';

@Component({
  selector: 'app-choose-shop',
  templateUrl: './choose-shop.component.html',
  styleUrls: ['./choose-shop.component.css']
})
export class ChooseShopComponent implements OnInit {

  constructor(public createShopDialog: MatDialog) { }

  shopDetails = {
    business_name: "Mnazi Mmoja",
    country: "",
    region: "",
    street: "",
  }
  openCreateShopDialog(){
    const dialogRef = this.createShopDialog.open(CreateShopComponent, {
      width: '400px',
      data: this.shopDetails
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  ngOnInit() {
  }

}
