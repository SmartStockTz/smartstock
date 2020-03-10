import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogImageCropComponent } from './dialog-image-crop.component';

describe('DialogImageCropComponent', () => {
  let component: DialogImageCropComponent;
  let fixture: ComponentFixture<DialogImageCropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogImageCropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogImageCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
