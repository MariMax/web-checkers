import { MovesManagerComponentMock } from './../../moves-manager/moves-manager.component.spec';
import {CellComponent} from './../cell/cell.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { DebugElement, PLATFORM_ID } from '@angular/core';
import {BoardComponent} from './board.component';
import {By} from '@angular/platform-browser';
import {PawnManagerComponentMock} from '../../pawn-manager/pawn-manager.component.spec';
import { ServerTestingModule, platformServerTesting } from '@angular/platform-server/testing';
import { PlatformService } from '../../services/platform/platform.service';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let debugElement: DebugElement;
  let platformService: PlatformService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoardComponent, CellComponent, PawnManagerComponentMock, MovesManagerComponentMock],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    platformService = TestBed.get(PlatformService);
  });

  afterEach(() => fixture.destroy());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate 100 cells', () => {
    fixture.detectChanges();
    const cells = debugElement.queryAll(By.css('web-checkers-cell'));
    expect(cells.length).toBe(100);
  });

  it(`should not try to read sizes if it's not a browser platform`, async () => {
    platformService.isBrowser = false;
    await fixture.detectChanges();
    expect(component.size).toBeNull();
  });

});
