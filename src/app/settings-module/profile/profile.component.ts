import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../common-components/DeviceInfo';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends DeviceInfo implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
