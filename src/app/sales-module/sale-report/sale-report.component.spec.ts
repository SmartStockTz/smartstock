import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReportComponent } from './sale-report.component';

describe('SaleReportComponent', () => {
  let component: SaleReportComponent;
  let fixture: ComponentFixture<SaleReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
