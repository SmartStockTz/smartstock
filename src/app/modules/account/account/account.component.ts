import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '../../lib/utils/device-info.util';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent extends DeviceInfoUtil implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
