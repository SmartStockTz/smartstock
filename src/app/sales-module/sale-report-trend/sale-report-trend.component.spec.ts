import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReportTrendComponent } from './sale-report-trend.component';

describe('SaleReportTrendComponent', () => {
  let component: SaleReportTrendComponent;
  let fixture: ComponentFixture<SaleReportTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleReportTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReportTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
