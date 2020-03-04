import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFrequentSoldProductComponent } from './dashboard-frequent-sold-product.component';

describe('DashboardFrequentSoldProductComponent', () => {
  let component: DashboardFrequentSoldProductComponent;
  let fixture: ComponentFixture<DashboardFrequentSoldProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFrequentSoldProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFrequentSoldProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
