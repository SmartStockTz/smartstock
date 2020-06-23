import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {UnitsI} from '../../../model/UnitsI';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {StorageService} from '../../../services/storage.service';


@Component({
  selector: 'app-stock-mobile',
  templateUrl: './stock-mobile.component.html',
  styleUrls: ['./stock-mobile.component.css']
})
export class StockMobileComponent extends DeviceInfo implements OnInit {

  constructor(private readonly router: Router,
              private readonly _storage: StorageService) {
    super();
  }

  showProgress = false;
  units: Observable<UnitsI[]>;
  @ViewChild('sidenav') sidenav: MatSidenav;

  ngOnInit() {
  }

}


