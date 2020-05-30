import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSalesComponent } from './total-sales.component';

describe('TotalSalesComponent', () => {
  let component: TotalSalesComponent;
  let fixture: ComponentFixture<TotalSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
