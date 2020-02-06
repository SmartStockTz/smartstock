import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReportsProductsComponent } from './sale-reports-products.component';

describe('SaleReportsProductsComponent', () => {
  let component: SaleReportsProductsComponent;
  let fixture: ComponentFixture<SaleReportsProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleReportsProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReportsProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
