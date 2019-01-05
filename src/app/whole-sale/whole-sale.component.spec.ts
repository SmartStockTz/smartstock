import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WholeSaleComponent } from './whole-sale.component';

describe('WholeSaleComponent', () => {
  let component: WholeSaleComponent;
  let fixture: ComponentFixture<WholeSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WholeSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WholeSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
