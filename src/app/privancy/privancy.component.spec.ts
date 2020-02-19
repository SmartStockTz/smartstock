import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivancyComponent } from './privancy.component';

describe('PrivancyComponent', () => {
  let component: PrivancyComponent;
  let fixture: ComponentFixture<PrivancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
