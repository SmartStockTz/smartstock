import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProductItemMobileUiComponent } from './stock-product-item-mobile-ui.component';

describe('StockProductItemComponent', () => {
  let component: StockProductItemMobileUiComponent;
  let fixture: ComponentFixture<StockProductItemMobileUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockProductItemMobileUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockProductItemMobileUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
