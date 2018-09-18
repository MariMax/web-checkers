import {InjectionToken, inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PlatformService } from '../platform/platform.service';

export const WINDOW = new InjectionToken('window', {
  providedIn: 'root',
  factory: () => {
    const platform = inject(PlatformService);
    if (platform.isBrowser) return window;
    return null;
  }
});
