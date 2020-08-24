import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReorderComponent } from '../components/reorder.component';

describe('StockReorderReportComponent', () => {
  let component: ReorderComponent;
  let fixture: ComponentFixture<ReorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
