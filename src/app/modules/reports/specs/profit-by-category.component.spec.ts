import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitByCategoryComponent } from '../components/profit-by-category.component';

describe('ProfitByCategoryComponent', () => {
  let component: ProfitByCategoryComponent;
  let fixture: ComponentFixture<ProfitByCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfitByCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
