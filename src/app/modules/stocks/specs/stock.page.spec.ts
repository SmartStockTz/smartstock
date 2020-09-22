import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ViewPageComponent} from '../pages/products.page';

describe('StockPage', () => {
  let component: ViewPageComponent;
  let fixture: ComponentFixture<ViewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
