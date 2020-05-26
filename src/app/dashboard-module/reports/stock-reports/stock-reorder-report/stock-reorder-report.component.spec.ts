import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReorderReportComponent } from './stock-reorder-report.component';

describe('StockReorderReportComponent', () => {
  let component: StockReorderReportComponent;
  let fixture: ComponentFixture<StockReorderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReorderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReorderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
