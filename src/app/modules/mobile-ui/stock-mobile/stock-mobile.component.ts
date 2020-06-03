
import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {UnitsI} from '../../../model/UnitsI';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {StorageService} from '../../../services/storage.service';


@Component({
  selector: 'app-stock-mobile',
  templateUrl: './stock-mobile.component.html',
  styleUrls: ['./stock-mobile.component.css']
})
export class StockMobileComponent  extends DeviceInfo implements OnInit {

  constructor(private readonly router: Router,
              private readonly _storage: StorageService) {
    super();
  }

  showProgress = false;
  units: Observable<UnitsI[]>;
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  ngOnInit() {
  }

}


