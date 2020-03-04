import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingInvoicesComponent } from './billing-invoices.component';

describe('BillingInvoicesComponent', () => {
  let component: BillingInvoicesComponent;
  let fixture: ComponentFixture<BillingInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
