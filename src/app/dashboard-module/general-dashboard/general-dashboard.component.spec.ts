import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDashboardComponent } from './general-dashboard.component';

describe('GeneralDashboardComponent', () => {
  let component: GeneralDashboardComponent;
  let fixture: ComponentFixture<GeneralDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
