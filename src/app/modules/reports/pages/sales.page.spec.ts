import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SalesPageComponent} from './sales.page';

describe('SalesReportsComponent', () => {
  let component: SalesPageComponent;
  let fixture: ComponentFixture<SalesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SalesPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
