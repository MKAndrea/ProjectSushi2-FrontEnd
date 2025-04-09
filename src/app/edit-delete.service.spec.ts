import { TestBed } from '@angular/core/testing';

import { EditDeleteService } from './edit-delete.service';

describe('EditDeleteService', () => {
  let service: EditDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
