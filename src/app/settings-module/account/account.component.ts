import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../common-components/DeviceInfo';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent extends DeviceInfo implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
