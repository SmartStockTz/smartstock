import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesLandingMobileComponent } from './sales-landing-mobile.component';

describe('SalesLandingComponent', () => {
  let component: SalesLandingMobileComponent;
  let fixture: ComponentFixture<SalesLandingMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesLandingMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesLandingMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
