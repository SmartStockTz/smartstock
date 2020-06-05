import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMobileComponent } from './stock-mobile.component';

describe('StockMobileComponent', () => {
  let component: StockMobileComponent;
  let fixture: ComponentFixture<StockMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
