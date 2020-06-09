import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsAboutToExpireComponent } from './products-about-to-expire.component';

describe('ProductsAboutToExpireComponent', () => {
  let component: ProductsAboutToExpireComponent;
  let fixture: ComponentFixture<ProductsAboutToExpireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsAboutToExpireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsAboutToExpireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
