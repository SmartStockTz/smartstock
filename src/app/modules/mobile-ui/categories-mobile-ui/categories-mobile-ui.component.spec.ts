import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesMobileUiComponent } from './categories-mobile-ui.component';

describe('CategoriesComponent', () => {
  let component: CategoriesMobileUiComponent;
  let fixture: ComponentFixture<CategoriesMobileUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesMobileUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesMobileUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
