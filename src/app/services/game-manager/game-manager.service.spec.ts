import { ActivePlayer } from './active-player.enum';
import { PawnTypes } from './pawn-types.enum';
import { TestBed, fakeAsync, tick as _tick } from '@angular/core/testing';

import { GameManagerService, BOARD_SIZE } from './game-manager.service';
import { asyncScheduler } from 'rxjs';

describe('GameManagerService', () => {
  let tick: (milliseconds: number) => void;

  beforeEach(() => {
    let fakeNow = 0;
    tick = milliseconds => {
      fakeNow += milliseconds;
      _tick(milliseconds);
    };
    asyncScheduler.now = () => fakeNow;
  });

  afterEach(() => delete asyncScheduler.now)

  it('should be created', () => {
    const service: GameManagerService = TestBed.get(GameManagerService);
    expect(service).toBeTruthy();
  });

  it('should generate an empty board', () => {
    const service: GameManagerService = TestBed.get(GameManagerService);
    const flattenBoard = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        flattenBoard.push(service.getPawnTypeAtLocation(i, j));
      }
    }
    expect(flattenBoard.every(i => i === PawnTypes.NONE));
  });

  it('should allow selection only when correct player is active', () => {
    const service: GameManagerService = TestBed.get(GameManagerService);
    const instance = service as any;
    instance.activePlayer = ActivePlayer.PLAYER1;
    expect(service.isSelectionAllowed(PawnTypes.NONE)).toBeFalsy();
    expect(service.isSelectionAllowed(PawnTypes.PL1_PAWN)).toBeTruthy();
    expect(service.isSelectionAllowed(PawnTypes.PL1_QUEEN)).toBeTruthy();
    expect(service.isSelectionAllowed(PawnTypes.PL2_PAWN)).toBeFalsy();
    expect(service.isSelectionAllowed(PawnTypes.PL2_QUEEN)).toBeFalsy();
    instance.activePlayer = ActivePlayer.PLAYER2;
    expect(service.isSelectionAllowed(PawnTypes.NONE)).toBeFalsy();
    expect(service.isSelectionAllowed(PawnTypes.PL1_PAWN)).toBeFalsy();
    expect(service.isSelectionAllowed(PawnTypes.PL1_QUEEN)).toBeFalsy();
    expect(service.isSelectionAllowed(PawnTypes.PL2_PAWN)).toBeTruthy();
    expect(service.isSelectionAllowed(PawnTypes.PL2_QUEEN)).toBeTruthy();
  });

  it('should generate correct initial state', () => {
    const service: GameManagerService = TestBed.get(GameManagerService);
    const instance = service as any;
    service.initGame();
    expect(instance.boardState).toEqual([0,2,0,2,0,2,0,2,
                                         2,0,2,0,2,0,2,0,
                                         0,2,0,2,0,2,0,2,
                                         0,0,0,0,0,0,0,0,
                                         0,0,0,0,0,0,0,0,
                                         1,0,1,0,1,0,1,0,
                                         0,1,0,1,0,1,0,1,
                                         1,0,1,0,1,0,1,0])
  });

  it('should return all the taken positions on the poard', () => {
    const service: GameManagerService = TestBed.get(GameManagerService);
    service.initGame();
    const allLocations = service.getPawnLocations();
    expect(allLocations).toEqual([
      {x: 1, y: 0},{x: 3, y: 0},{x: 5, y: 0},{x: 7, y: 0},
      {x: 0, y: 1},{x: 2, y: 1},{x: 4, y: 1},{x: 6, y: 1},
      {x: 1, y: 2},{x: 3, y: 2},{x: 5, y: 2},{x: 7, y: 2},
      {x: 0, y: 5},{x: 2, y: 5},{x: 4, y: 5},{x: 6, y: 5},
      {x: 1, y: 6},{x: 3, y: 6},{x: 5, y: 6},{x: 7, y: 6},
      {x: 0, y: 7},{x: 2, y: 7},{x: 4, y: 7},{x: 6, y: 7},
    ])
  });

  it('should notify about turn change every 2 seconds', fakeAsync(() => {
    let counter = 0;
    let counter2 = 0;
    const service: GameManagerService = TestBed.get(GameManagerService);
    const subscription = service.subscribeOnTurnChange(() => {
      counter++;
    });
    const subscription2 = service.subscribeOnTurnChange(() => {
      counter2++;
    });

    tick(1);
    expect(counter).toBe(1);
    expect(counter2).toBe(1);
    tick(2000);
    expect(counter).toBe(2);
    expect(counter2).toBe(2);
    subscription.unsubscribe();
    tick(2000);
    expect(counter).toBe(2);
    expect(counter2).toBe(3);
    subscription2.unsubscribe();
    tick(2000);
    expect(counter).toBe(2);
    expect(counter2).toBe(3);
  }))

});
