import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EventApiService} from '../../../services/event-api.service';
import {SettingsService} from '../../../services/settings.service';
import {SsmEvents} from '../../../utils/eventsNames';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent extends DeviceInfo implements OnInit {
  settingsForm: FormGroup;
  getSettingsProgress = false;
  saveSettingProgress = false;

  isMobile = environment.android;
  constructor(private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              private readonly eventApi: EventApiService,
              private readonly settings: SettingsService) {
    super();
  }

  ngOnInit() {
    this._getSettings();
  }

  private _getSettings() {
    this.getSettingsProgress = true;
    this.settings.getSettings().then(value => {
      this._initiateSettingsForm(value);
      this.getSettingsProgress = false;
    }).catch(reason => {
      console.log(reason);
      this._initiateSettingsForm({
        saleWithoutPrinter: true,
        printerHeader: '',
        printerFooter: '',
        allowRetail: true,
        allowWholesale: true,
      });
      this.getSettingsProgress = false;
    });
  }

  private _initiateSettingsForm(settings: any) {
    this.settingsForm = this.formBuilder.group({
      'saleWithoutPrinter': [settings.saleWithoutPrinter],
      'printerHeader': [settings.printerHeader],
      'printerFooter': [settings.printerFooter],
      'allowRetail': [settings.allowRetail],
      'allowWholesale': [settings.allowWholesale],
    });
  }

  saveSettings() {
    this.saveSettingProgress = true;
    this.settings.saveSettings(this.settingsForm.value).then(_ => {
      this.snack.open('Settings saved', 'Ok', {
        duration: 3000
      });
      this.saveSettingProgress = false;
      this.eventApi.broadcast(SsmEvents.SETTINGS_UPDATED);
    }).catch(reason => {
      console.warn(reason);
      this.snack.open('Fails to save settings, try again later', 'Ok', {
        duration: 3000
      });
      this.saveSettingProgress = false;
    });
  }
}
