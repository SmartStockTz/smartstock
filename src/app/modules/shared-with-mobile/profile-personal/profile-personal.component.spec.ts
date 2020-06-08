import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePersonalComponent } from './profile-personal.component';

describe('ProfilePersonalComponent', () => {
  let component: ProfilePersonalComponent;
  let fixture: ComponentFixture<ProfilePersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
