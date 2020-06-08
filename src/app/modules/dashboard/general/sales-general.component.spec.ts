import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesGeneralComponent } from './sales-general.component';

describe('DashboardQuickReportComponent', () => {
  let component: SalesGeneralComponent;
  let fixture: ComponentFixture<SalesGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
