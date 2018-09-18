import {TestBed} from '@angular/core/testing';

import {WINDOW} from './window-injector.service';
import { inject } from '@angular/core';
import { PlatformService } from '../platform/platform.service';

describe('WindowInjectorService', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Window = TestBed.get(WINDOW);
    expect(service).toBe(window);
  });

  it('should be created as null on server', () => {
    const paltform = TestBed.get(PlatformService);
    paltform.isBrowser = false;
    const service: Window = TestBed.get(WINDOW);
    expect(service).toBeNull();
  });
});