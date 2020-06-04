import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersMobileComponent } from './users-mobile.component';

describe('UsersMobileComponent', () => {
  let component: UsersMobileComponent;
  let fixture: ComponentFixture<UsersMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
