import { TestBed } from '@angular/core/testing';

import { MessageService } from '../services/message.service';

describe('InfoMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageService = TestBed.get(MessageService);
    expect(service).toBeTruthy();
  });
});
