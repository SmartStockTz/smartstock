import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../common-components/DeviceInfo';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SettingsServiceService} from '../../services/Settings-service.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent extends DeviceInfo implements OnInit {
  settingsForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly settings: SettingsServiceService) {
    super();
  }

  ngOnInit() {
    this._initiateSettingsForm();
  }

  private _getSettings() {

  }

  private _initiateSettingsForm() {
    this.settingsForm = this.formBuilder.group({
      'saleWithoutPrinter': [true],
      'printerHeader': [''],
      'printerFooter': [''],
    });
  }

}
