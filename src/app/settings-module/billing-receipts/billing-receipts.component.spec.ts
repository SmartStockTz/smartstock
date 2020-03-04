import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingReceiptsComponent } from './billing-receipts.component';

describe('BillingReceiptsComponent', () => {
  let component: BillingReceiptsComponent;
  let fixture: ComponentFixture<BillingReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
