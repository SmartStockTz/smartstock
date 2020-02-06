import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardQuickReportComponent } from './dashboard-quick-report.component';

describe('DashboardQuickReportComponent', () => {
  let component: DashboardQuickReportComponent;
  let fixture: ComponentFixture<DashboardQuickReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardQuickReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardQuickReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
