import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProductsMobileUiComponent } from './stock-products-mobile-ui.component';

describe('StockProductsComponent', () => {
  let component: StockProductsMobileUiComponent;
  let fixture: ComponentFixture<StockProductsMobileUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockProductsMobileUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockProductsMobileUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
