import { TestBed } from '@angular/core/testing';

import { EventApiService } from './event-api.service';

describe('EventApiService', () => {
  let service: EventApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
