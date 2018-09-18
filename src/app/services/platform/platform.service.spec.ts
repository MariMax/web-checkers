import {TestBed} from '@angular/core/testing';

import {PlatformService} from './platform.service';
import {PLATFORM_ID} from '@angular/core';

describe('PlatformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlatformService = TestBed.get(PlatformService);
    expect(service).toBeTruthy();
  });

  it('should set isBrowser to true in browser', () => {
    const service: PlatformService = TestBed.get(PlatformService);
    expect(service.isBrowser).toBeTruthy();
  });
});

describe('PlatformService Server', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [{provide: PLATFORM_ID, useValue: 'server'}]
    }));

  it('should set isBrowser to false on server', () => {
    const service: PlatformService = TestBed.get(PlatformService);
    expect(service.isBrowser).toBeFalsy();
  });
});
