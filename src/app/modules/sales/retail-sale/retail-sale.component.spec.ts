import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailSaleComponent } from './retail-sale.component';

describe('RetailSaleComponent', () => {
  let component: RetailSaleComponent;
  let fixture: ComponentFixture<RetailSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
