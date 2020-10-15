import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EventService} from '@smartstock/core-libs';
import {SettingsService} from '../services/settings.service';
import {environment} from '../../../../environments/environment';
import {DeviceInfoUtil} from '@smartstock/core-libs';
import {SsmEvents} from '@smartstock/core-libs';

@Component({
  selector: 'smartstock-setting',
  template: `
      <mat-sidenav-container class="match-parent">
          <mat-sidenav class="match-parent-side"
                       [fixedInViewport]="true"
                       #sidenav
                       [mode]="enoughWidth()?'side':'over'"
                       [opened]="!isMobile">
              <smartstock-drawer></smartstock-drawer>
          </mat-sidenav>

          <mat-sidenav-content>
              <smartstock-toolbar [heading]="'General'"
                                  [sidenav]="sidenav"
                                  [hasBackRoute]="isMobile"
                                  [backLink]="'/account'"
                                  [showProgress]="false">
              </smartstock-toolbar>

              <div class="container d-flex flex-column justify-content-center align-items-center stock-new-wrapper">
                  <mat-progress-spinner *ngIf="getSettingsProgress" [diameter]="20" mode="indeterminate"
                                        [matTooltip]="'Fetch settings'"
                                        color="primary"></mat-progress-spinner>
                  <form *ngIf="!getSettingsProgress && settingsForm" [formGroup]="settingsForm"
                        style="margin-top: 16px"
                        class="col-xl-10 col-lg-10 col-md-12 col-sm-12 col-12">

                      <h4>Sales</h4>
                      <mat-card class="mat-elevation-z0">
                          <mat-card-content>

                              <div class="d-flex flex-row align-items-center">
                                  <mat-card-subtitle>Allow Retail</mat-card-subtitle>
                                  <span class="toolbar-spacer"></span>
                                  <mat-slide-toggle
                                          formControlName="allowRetail"
                                          matTooltip="If you disable you wont sale without printer" color="primary"
                                          labelPosition="after">
                                  </mat-slide-toggle>
                              </div>
                              <div style="height: 20px"></div>
                              <div class="d-flex flex-row align-items-center">
                                  <mat-card-subtitle>Allow Wholesale</mat-card-subtitle>
                                  <span class="toolbar-spacer"></span>
                                  <mat-slide-toggle
                                          formControlName="allowWholesale"
                                          matTooltip="If you disable you wont sale without printer" color="primary"
                                          labelPosition="after">
                                  </mat-slide-toggle>
                              </div>
                          </mat-card-content>
                      </mat-card>
                      <div style="height: 20px"></div>
                      <h4>Printer</h4>
                      <mat-card class="mat-elevation-z0">
                          <mat-card-content>
                              <div class="d-flex flex-row align-items-center">
                                  <mat-card-subtitle>Allow to sale without printer</mat-card-subtitle>
                                  <span class="toolbar-spacer"></span>
                                  <mat-slide-toggle
                                          formControlName="saleWithoutPrinter"
                                          matTooltip="If you disable you wont sale without printer" color="primary"
                                          labelPosition="after">
                                  </mat-slide-toggle>
                              </div>

                              <div style="margin-top: 16px">
                                  <!--              <mat-card-subtitle>Header message</mat-card-subtitle>-->
                                  <mat-form-field appearance="fill">
                                      <mat-label>Header</mat-label>
                                      <textarea matTooltip="This content will be shown on top of a receipt when printed"
                                                formControlName="printerHeader"
                                                placeholder="Type here..." matInput type="text" [rows]="6">
                </textarea>
                                  </mat-form-field>
                              </div>

                              <div style="margin-top: 16px">
                                  <!--              <mat-card-subtitle>Header message</mat-card-subtitle>-->
                                  <mat-form-field appearance="fill">
                                      <mat-label>Footer</mat-label>
                                      <textarea matTooltip="This content will be shown on bottom of a receipt when printed"
                                                formControlName="printerFooter"
                                                placeholder="Type here..." matInput type="text" [rows]="6">
                </textarea>
                                  </mat-form-field>
                              </div>

                          </mat-card-content>
                      </mat-card>

                      <button [disabled]="saveSettingProgress || !settingsForm.dirty"
                              style="margin-top: 16px; margin-bottom: 16px"
                              color="primary"
                              mat-flat-button
                              (click)="saveSettings()"
                              class="btn-block ft-button">Update
                          <mat-progress-spinner style="display: inline-block" *ngIf="saveSettingProgress" [diameter]="20"
                                                color="primary"
                                                mode="indeterminate">
                          </mat-progress-spinner>
                      </button>

                  </form>

              </div>
          </mat-sidenav-content>

      </mat-sidenav-container>

      <!--<smartstock-settings-general *ngIf="isMobile"></smartstock-settings-general>-->
  `,
  styleUrls: ['../style/setting.style.css']
})
export class SettingsPage extends DeviceInfoUtil implements OnInit {
  settingsForm: FormGroup;
  getSettingsProgress = false;
  saveSettingProgress = false;

  isMobile = environment.android;
  constructor(private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              private readonly eventApi: EventService,
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
      // console.log(reason);
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
