import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingPage } from '../pages/billing.page';

describe('BillingComponent', () => {
  let component: BillingPage;
  let fixture: ComponentFixture<BillingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
