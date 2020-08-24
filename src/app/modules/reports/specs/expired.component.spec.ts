import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredComponent } from '../components/expired.component';

describe('ExpiredProductsReportComponent', () => {
  let component: ExpiredComponent;
  let fixture: ComponentFixture<ExpiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
