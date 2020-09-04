import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'smartstock-business-details-form',
  template: `
    <form [formGroup]="businessFormGroup">
      <div class="stepper-inputs">
        <mat-form-field appearance="fill">
          <mat-label>Business Name</mat-label>
          <mat-icon matSuffix>business</mat-icon>
          <input matInput class="inputs" type="text" formControlName="businessName"
                 required>
          <mat-error>Business name required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Shop Category</mat-label>
          <mat-icon matSuffix>category</mat-icon>
          <mat-select formControlName="category" class="" required="">
            <mat-option value="atrists_photographers_creative">Artists, Photographers &amp; Creative Types
            </mat-option>
            <mat-option value="consultants_professionals">Consultants &amp; Professionals</mat-option>
            <mat-option value="finance_insurance">Financial Services</mat-option>
            <mat-option value="product_provider">General: I make or sell a PRODUCT</mat-option>
            <mat-option value="service_provider">General: I provide a SERVICE</mat-option>
            <mat-option value="hair_spa_aesthetics">Hair, Spa &amp; Aesthetics</mat-option>
            <mat-option value="medical_dental_health_service">Medical, Dental, Health</mat-option>
            <mat-option value="nonprofit_associations_groups">Non-profits, Associations &amp; Groups</mat-option>
            <mat-option value="realestate_home">Real Estate, Construction &amp; Home Improvement</mat-option>
            <mat-option value="retailers_and_resellers">Retailers, Resellers &amp; Sales</mat-option>
            <mat-option value="web_media_freelancer">Web, Tech &amp; Media</mat-option>
          </mat-select>
          <mat-error>Choose category</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Country</mat-label>
          <mat-icon matSuffix>person_pin</mat-icon>
          <input matInput class="inputs" type="text" formControlName="country" required>
          <mat-error>Country required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Region</mat-label>
          <mat-icon matSuffix>person_pin</mat-icon>
          <input matInput class="inputs" type="text" formControlName="region" required>
          <mat-error>Region required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Street / Business location</mat-label>
          <mat-icon matSuffix>person_pin</mat-icon>
          <textarea matInput class="inputs" formControlName="street"
                    required></textarea>
          <mat-error>Street required</mat-error>
        </mat-form-field>

      </div>
      <div>
        <button mat-button class="stepper-btn" matStepperPrevious>Back</button>
        <button mat-button class="stepper-btn" matStepperNext>Next</button>
      </div>
    </form>
  `,
  styleUrls: ['../style/register.style.css']
})

export class BusinessDetailsFormComponent implements OnInit {
  @Input() businessFormGroup: FormGroup;

  constructor() {
  }

  ngOnInit(): void {
  }
}
