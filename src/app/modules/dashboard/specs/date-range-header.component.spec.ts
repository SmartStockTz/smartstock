import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DateRangeHeaderComponent} from '../components/date-range-header.component';

describe('DateRangeSelectorComponent', () => {
  let component: DateRangeHeaderComponent<any>;
  let fixture: ComponentFixture<DateRangeHeaderComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DateRangeHeaderComponent]
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
