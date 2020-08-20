import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {DeviceInfoUtil} from '../../lib/utils/device-info.util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends DeviceInfoUtil implements OnInit {

  isMobile = environment.android;
  constructor() {
    super();
  }

  ngOnInit() {
  }

}
