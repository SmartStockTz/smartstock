import { TestBed } from '@angular/core/testing';

import { EventService } from '../services/event.service';

describe('EventApiService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
