import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingMobileComponent } from './billing-mobile.component';

describe('BillingMobileComponent', () => {
  let component: BillingMobileComponent;
  let fixture: ComponentFixture<BillingMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
