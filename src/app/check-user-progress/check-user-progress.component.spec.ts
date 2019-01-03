import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckUserProgressComponent } from './check-user-progress.component';

describe('CheckUserProgressComponent', () => {
  let component: CheckUserProgressComponent;
  let fixture: ComponentFixture<CheckUserProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckUserProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckUserProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
