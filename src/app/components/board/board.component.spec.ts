import {CellComponent} from './../cell/cell.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { DebugElement, PLATFORM_ID } from '@angular/core';
import {BoardComponent} from './board.component';
import {By} from '@angular/platform-browser';
import {PawnManagerComponentMock} from '../../pawn-manager/pawn-manager.component.spec';
import { ServerTestingModule, platformServerTesting } from '@angular/platform-server/testing';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let debugElement: DebugElement;
  let isBrowser;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoardComponent, CellComponent, PawnManagerComponentMock],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate 100 cells', () => {
    const cells = debugElement.queryAll(By.css('web-checkers-cell'));
    expect(cells.length).toBe(100);
  });
});

describe(`server version`, () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async(() => {
    TestBed
    .configureTestingModule({
      declarations: [BoardComponent, CellComponent, PawnManagerComponentMock],
    })
    .overrideComponent(BoardComponent, {
      set: {
        providers: [
          {provide: PLATFORM_ID, useValue: 'server'}
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should not try to read sizes if it's not a browser platform`, () => {
    expect(component.size).toBeNull();
  });
});
