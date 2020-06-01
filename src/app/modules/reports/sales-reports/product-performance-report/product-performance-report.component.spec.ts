import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPerformanceReportComponent } from './product-performance-report.component';

describe('ProductPerformanceReportComponent', () => {
  let component: ProductPerformanceReportComponent;
  let fixture: ComponentFixture<ProductPerformanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPerformanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
