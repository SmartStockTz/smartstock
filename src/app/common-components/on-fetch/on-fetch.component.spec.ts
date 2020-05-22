import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnFetchComponent } from './on-fetch.component';

describe('OnFetchComponent', () => {
  let component: OnFetchComponent;
  let fixture: ComponentFixture<OnFetchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnFetchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
