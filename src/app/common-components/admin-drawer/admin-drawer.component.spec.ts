import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDrawerComponent } from './admin-drawer.component';

describe('NavComponent', () => {
  let component: AdminDrawerComponent;
  let fixture: ComponentFixture<AdminDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
