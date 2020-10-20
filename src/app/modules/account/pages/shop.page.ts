import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CreateShopDialogComponent} from '../components/create-shop-dialog.component';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {ShopModel} from '../models/shop.model';
import {StorageService} from '@smartstocktz/core-libs';
import {UserService} from '../services/user.service';

@Component({
  selector: 'smartstock-choose-shop',
  template: `
    <div class="main">
      <div class="container_shops d-flex flex-column justify-content-start justify-content-center align-items-center">
        <div class="container_logo d-flex">
          <div class="logo">
            <img alt="" width="100" src="../../../../assets/img/ss_logo_white%203.svg">
          </div>
        </div>
        <div style="margin-bottom: 10px" class="ct_shops_title d-flex justify-content-center">
          Choose Shop
        </div>

        <div class="d-flex flex-wrap btn-block justify-content-center">

          <div (click)="setCurrentProject(shop)" *ngFor="let shop of shops | async" class="ct_shop_profile">
            <div matRipple class="shop_profile">
              <mat-icon style="width: 70px; height: 70px; font-size: 70px" color="primary">store</mat-icon>
            </div>
            <div matTooltip="{{shop.businessName}}"
                 class="shop_name d-flex justify-content-center">
              {{shop.businessName}}
            </div>
          </div>

<!--          <div class="ct_shop_profile">-->
          <!--            <div matRipple class="ct_add_shop d-flex justify-content-center" (click)="openCreateShopDialog()">-->
          <!--              <div class="add_shop_btn d-flex justify-content-center">-->
          <!--                <img alt="shop image" src="../../../../assets/img/plus_sign.svg">-->
          <!--              </div>-->
          <!--            </div>-->
          <!--            <div class="shop_name d-flex justify-content-center">Add Shop</div>-->
          <!--          </div>-->

        </div>

      </div>
    </div>
  `,
  styleUrls: ['../style/shop.style.css']
})
export class ShopPage implements OnInit {

  shopDetails = {};
  shops: Observable<ShopModel[]>;

  constructor(public createShopDialog: MatDialog,
              private readonly _snack: MatSnackBar,
              private readonly _router: Router,
              private readonly _storage: StorageService,
              private readonly userDatabase: UserService) {
  }

  openCreateShopDialog() {
    const dialogRef = this.createShopDialog.open(CreateShopDialogComponent, {
      minWidth: 350,
      data: this.shopDetails,
      disableClose: true,
      closeOnNavigation: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._getShops();
      } else {
        // console.log('no shop to append');
      }
    });
  }

  ngOnInit() {
    this._getShops();
  }

  private _getShops() {
    this.userDatabase.getShops().then(shops => {
      this.shops = of(shops);
    }).catch(reason => {
      // console.log(reason);
      this._snack.open('Error when fetch available shops', 'Ok', {
        duration: 3000
      });
    });
  }

  setCurrentProject(shop: ShopModel) {
    this.userDatabase.saveCurrentShop(shop).then(_ => {
      this._router.navigateByUrl('/dashboard').catch(reason => console.log(reason));
    }).catch(reason => {
      // console.log(reason);
      this._snack.open('Error when trying to save your current shop', 'Ok', {
        duration: 3000
      });
    });
  }
}
