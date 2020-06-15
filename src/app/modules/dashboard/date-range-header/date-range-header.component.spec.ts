import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeHeaderComponent } from './date-range-header.component';

describe('DateRangeSelectorComponent', () => {
  let component: DateRangeHeaderComponent;
  let fixture: ComponentFixture<DateRangeHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateRangeHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
