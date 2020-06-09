import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartReportComponent } from './cart-report.component';

describe('CartReportComponent', () => {
  let component: CartReportComponent;
  let fixture: ComponentFixture<CartReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
