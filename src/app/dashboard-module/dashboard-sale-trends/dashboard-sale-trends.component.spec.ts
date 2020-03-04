import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSaleTrendsComponent } from './dashboard-sale-trends.component';

describe('DashboardSaleTrendsComponent', () => {
  let component: DashboardSaleTrendsComponent;
  let fixture: ComponentFixture<DashboardSaleTrendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSaleTrendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSaleTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
