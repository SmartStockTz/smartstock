import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPerformanceComponent } from '../components/product-performance.component';

describe('ProductPerformanceReportComponent', () => {
  let component: ProductPerformanceComponent;
  let fixture: ComponentFixture<ProductPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
