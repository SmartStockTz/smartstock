import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DeviceInfo} from '../../../shared/DeviceInfo';
import {InfoMessageService} from '../../../../services/info-message.service';
import {SettingsService} from '../../../../services/settings.service';


@Component({
  selector: 'app-settings-general',
  templateUrl: './settings-general.component.html',
  styleUrls: ['./settings-general.component.css']
})
export class SettingsGeneralComponent extends DeviceInfo implements OnInit {
  settingsForm: FormGroup;
  getSettingsProgress = false;
  saveSettingProgress = false;

  constructor(private readonly _formBuilder: FormBuilder,
              private readonly _infoMessage: InfoMessageService,
              private readonly _settings: SettingsService) {
    super();
  }

  ngOnInit() {
    this._getSettings();
  }

  private _getSettings() {
    this.getSettingsProgress = true;
    this._settings.getSettings().then(value => {
      this._initiateSettingsForm(value);
      this.getSettingsProgress = false;
    }).catch(reason => {
      console.log(reason);
      this._initiateSettingsForm({
        saleWithoutPrinter: true,
        printerHeader: '',
        printerFooter: ''
      });
      this.getSettingsProgress = false;
    });
  }

  private _initiateSettingsForm(settings: any) {
    this.settingsForm = this._formBuilder.group({
      'saleWithoutPrinter': [settings.saleWithoutPrinter],
      'printerHeader': [settings.printerHeader],
      'printerFooter': [settings.printerFooter],
    });
  }

  saveSettings() {
    this.saveSettingProgress = true;
    this._settings.saveSettings(this.settingsForm.value).then(_ => {
      this._infoMessage.showMobileInfoMessage('Settings saved', 3000);
      this.saveSettingProgress = false;
    }).catch(reason => {
      console.warn(reason);
      this._infoMessage.showMobileInfoMessage('Fails to save settings, try again later', 3000);
      this.saveSettingProgress = false;
    });
  }
}
