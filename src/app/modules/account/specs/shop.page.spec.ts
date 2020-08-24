import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopPage } from '../pages/shop.page';

describe('ChooseShopComponent', () => {
  let component: ShopPage;
  let fixture: ComponentFixture<ShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
