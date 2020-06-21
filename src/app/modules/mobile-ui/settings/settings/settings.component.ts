import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../../shared/DeviceInfo';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends DeviceInfo implements OnInit {
  isMobile = environment.android;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
