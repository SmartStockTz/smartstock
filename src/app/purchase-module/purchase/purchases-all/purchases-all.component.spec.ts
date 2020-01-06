import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesAllComponent } from './purchases-all.component';

describe('PurchasesAllComponent', () => {
  let component: PurchasesAllComponent;
  let fixture: ComponentFixture<PurchasesAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasesAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
