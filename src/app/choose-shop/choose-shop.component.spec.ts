import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseShopComponent } from './choose-shop.component';

describe('ChooseShopComponent', () => {
  let component: ChooseShopComponent;
  let fixture: ComponentFixture<ChooseShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
