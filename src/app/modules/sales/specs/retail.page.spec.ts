import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailPageComponent } from '../pages/retail.page';

describe('RetailSaleComponent', () => {
  let component: RetailPageComponent;
  let fixture: ComponentFixture<RetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
