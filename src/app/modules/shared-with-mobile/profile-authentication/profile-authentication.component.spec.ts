import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAutheticationComponent } from './profile-authentication.component';

describe('ProfileAutheticationComponent', () => {
  let component: ProfileAutheticationComponent;
  let fixture: ComponentFixture<ProfileAutheticationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileAutheticationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAutheticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
