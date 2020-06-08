import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsMobileUiComponent } from './units-mobile-ui.component';

describe('UnitsComponent', () => {
  let component: UnitsMobileUiComponent;
  let fixture: ComponentFixture<UnitsMobileUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitsMobileUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsMobileUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
