import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../../shared/DeviceInfo';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends DeviceInfo implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
