import { TestBed } from '@angular/core/testing';

import { MovementManagerService } from './movement-manager.service';

describe('MovementManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MovementManagerService = TestBed.get(MovementManagerService);
    expect(service).toBeTruthy();
  });
});
