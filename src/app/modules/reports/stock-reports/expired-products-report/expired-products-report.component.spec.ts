import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredProductsReportComponent } from './expired-products-report.component';

describe('ExpiredProductsReportComponent', () => {
  let component: ExpiredProductsReportComponent;
  let fixture: ComponentFixture<ExpiredProductsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredProductsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredProductsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
