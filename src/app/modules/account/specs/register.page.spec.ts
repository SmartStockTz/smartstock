import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPage } from '../pages/register.page';

describe('RegisterComponent', () => {
  let registerComponent: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPage);
    registerComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(registerComponent).toBeTruthy();
  });

  it('should register a user', function () {
    registerComponent.openAccount()
  });
});
