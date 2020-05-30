import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAuthenticationComponent } from './profile-authentication.component';

describe('ProfileAuthenticationComponent', () => {
  let component: ProfileAuthenticationComponent;
  let fixture: ComponentFixture<ProfileAuthenticationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileAuthenticationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
