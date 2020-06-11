import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockExpiredComponent } from './stock-expired.component';

describe('StockExpiredComponent', () => {
  let component: StockExpiredComponent;
  let fixture: ComponentFixture<StockExpiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockExpiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
