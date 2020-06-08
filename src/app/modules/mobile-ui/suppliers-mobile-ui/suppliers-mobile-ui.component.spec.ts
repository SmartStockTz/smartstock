import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersMobileUiComponent } from './suppliers-mobile-ui.component';

describe('SuppliersComponent', () => {
  let component: SuppliersMobileUiComponent;
  let fixture: ComponentFixture<SuppliersMobileUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppliersMobileUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersMobileUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
