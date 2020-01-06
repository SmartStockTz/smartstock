import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesReceiptsComponent } from './purchases-receipts.component';

describe('PurchasesReceiptsComponent', () => {
  let component: PurchasesReceiptsComponent;
  let fixture: ComponentFixture<PurchasesReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasesReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
