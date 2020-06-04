import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends DeviceInfo implements OnInit {

  isMobile = environment.android;
  constructor() {
    super();
  }

  ngOnInit() {
  }

}
