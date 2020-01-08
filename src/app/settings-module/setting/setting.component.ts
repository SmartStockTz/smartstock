import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../common-components/DeviceInfo';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SettingsServiceService} from '../../services/Settings-service.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent extends DeviceInfo implements OnInit {
  settingsForm: FormGroup;
  getSettingsProgress = false;
  saveSettingProgress = false;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              private readonly settings: SettingsServiceService) {
    super();
  }

  ngOnInit() {
    this._initiateSettingsForm(null);
    this._getSettings();
  }

  private _getSettings() {
    // this.getSettingsProgress = true;
    // this.settings.getSettings().then(value => {
    //   this._initiateSettingsForm();
    //   this.getSettingsProgress = false;
    // }).catch(reason => {
    //
    //   this.getSettingsProgress = false;
    // });
  }

  private _initiateSettingsForm(settings: any) {
    this.settingsForm = this.formBuilder.group({
      'saleWithoutPrinter': [true],
      'printerHeader': [''],
      'printerFooter': [''],
    });
  }

  saveSettings() {
    this.saveSettingProgress = true;
    this.settings.saveSettings(this.settingsForm.value).then(_ => {
      this.snack.open('Settings saved', 'Ok', {
        duration: 3000
      });
      this.saveSettingProgress = false;
    }).catch(reason => {
      console.warn(reason);
      this.snack.open('Fails to save settings, try again later', 'Ok', {
        duration: 3000
      });
      this.saveSettingProgress = false;
    });
  }
}
