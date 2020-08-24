import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePayDetailsComponent } from '../components/mobile-pay-details.component';

describe('MobilePayDetailsComponent', () => {
  let component: MobilePayDetailsComponent;
  let fixture: ComponentFixture<MobilePayDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilePayDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilePayDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
