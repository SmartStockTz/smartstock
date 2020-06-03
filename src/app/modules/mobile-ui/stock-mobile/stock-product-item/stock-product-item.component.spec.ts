import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProductItemComponent } from './stock-product-item.component';

describe('StockProductItemComponent', () => {
  let component: StockProductItemComponent;
  let fixture: ComponentFixture<StockProductItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockProductItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockProductItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
