import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  isBrowser: boolean = isPlatformBrowser(this._platformId);

  constructor(@Inject(PLATFORM_ID) private _platformId: Object) { }
}
