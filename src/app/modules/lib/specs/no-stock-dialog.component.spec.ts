import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoStockDialogComponent } from '../components/no-stock-dialog.component';

describe('NoStockDialogComponent', () => {
  let component: NoStockDialogComponent;
  let fixture: ComponentFixture<NoStockDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoStockDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoStockDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
