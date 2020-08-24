import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CreatePageComponent} from '../pages/create.page';


describe('PurchaseCreateComponent', () => {
  let component: CreatePageComponent;
  let fixture: ComponentFixture<CreatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
