import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalGrossSaleComponent } from '../components/total-gross-sale.component';

describe('TotalGrossSaleComponent', () => {
  let component: TotalGrossSaleComponent;
  let fixture: ComponentFixture<TotalGrossSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalGrossSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalGrossSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
