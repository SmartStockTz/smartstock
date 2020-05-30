import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataNotReadyComponent } from './data-not-ready.component';

describe('DataNotReadyComponent', () => {
  let component: DataNotReadyComponent;
  let fixture: ComponentFixture<DataNotReadyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataNotReadyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataNotReadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
