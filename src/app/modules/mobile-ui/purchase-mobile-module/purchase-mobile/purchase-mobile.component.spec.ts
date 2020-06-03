import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseMobileComponent } from './purchase-mobile.component';

describe('PurchaseMobileComponent', () => {
  let component: PurchaseMobileComponent;
  let fixture: ComponentFixture<PurchaseMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
