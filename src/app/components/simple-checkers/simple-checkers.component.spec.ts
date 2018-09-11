import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { SimpleCheckersComponent } from './simple-checkers.component';

describe('SimpleCheckersComponent', () => {
  let component: SimpleCheckersComponent;
  let fixture: ComponentFixture<SimpleCheckersComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleCheckersComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleCheckersComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy())

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shold have board', () => {
    expect(debugElement.query(By.css('web-checkers-board'))).toBeTruthy();
  });
});
