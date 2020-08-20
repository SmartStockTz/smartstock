import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockByCategoryComponent } from './stock-by-category.component';

describe('StockByCategoryComponent', () => {
  let component: StockByCategoryComponent;
  let fixture: ComponentFixture<StockByCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockByCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
