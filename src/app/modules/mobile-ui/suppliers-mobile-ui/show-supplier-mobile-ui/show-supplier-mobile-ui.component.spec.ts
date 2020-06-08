import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSupplierMobileUiComponent } from './show-supplier-mobile-ui.component';

describe('ShowSupplierComponent', () => {
  let component: ShowSupplierMobileUiComponent;
  let fixture: ComponentFixture<ShowSupplierMobileUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSupplierMobileUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSupplierMobileUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
