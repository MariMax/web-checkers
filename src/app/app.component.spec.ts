import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let instance;
  let initGameSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    instance = app as any;
    initGameSpy = spyOn(instance.gameManager, 'initGame');
  })
  afterEach(() => fixture.destroy())
  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

  it('should init the game', async () => {
    expect(app).toBeTruthy();
    await fixture.detectChanges();
    expect(initGameSpy).toHaveBeenCalled();
  });

});
