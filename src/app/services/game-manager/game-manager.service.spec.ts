import { PlayerType } from './active-player.enum';
import { PawnTypes } from './pawn-types.enum';
import { TestBed, fakeAsync, tick} from '@angular/core/testing';

import { GameManagerService, BOARD_SIZE } from './game-manager.service';
import { asyncScheduler } from 'rxjs';
import { PawnModel } from '../../data-structures/pawn/pawn.model';
import { Position } from './position';

describe('GameManagerService', () => {

  it('should be created', () => {
    const service: GameManagerService = TestBed.get(GameManagerService);
    expect(service).toBeTruthy();
  });

  it('should generate an empty board', () => {
    const service: GameManagerService = TestBed.get(GameManagerService);
    const flattenBoard = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        flattenBoard.push(service.getPawnModelAtLocation(new Position(i, j)));
      }
    }
    expect(flattenBoard.every(i => i === null));
  });

  it('should allow selection only when correct player is active', () => {
    const service: GameManagerService = TestBed.get(GameManagerService);
    const instance = service as any;
    const p1Pawn = new PawnModel();
    p1Pawn.owner = PlayerType.PLAYER1;
    const p2Pawn = new PawnModel();
    p2Pawn.owner = PlayerType.PLAYER2;
    instance.activePlayer = PlayerType.PLAYER1;
    expect(service.isSelectionAllowed(p2Pawn)).toBeFalsy();
    expect(service.isSelectionAllowed(p1Pawn)).toBeTruthy();
    instance.activePlayer = PlayerType.PLAYER2;
    expect(service.isSelectionAllowed(p1Pawn)).toBeFalsy();
    expect(service.isSelectionAllowed(p2Pawn)).toBeTruthy();
  });

  it('should return correct movement direction for active player', () => {
    const service: GameManagerService = TestBed.get(GameManagerService);
    const instance = service as any;
    instance.activePlayer = PlayerType.PLAYER1;
    expect(service.getMovementDirection()).toBe(-1);
    instance.activePlayer = PlayerType.PLAYER2;
    expect(service.getMovementDirection()).toBe(1);
  });

  it('should generate correct initial state', () => {
    const service: GameManagerService = TestBed.get(GameManagerService);
    const instance = service as any;
    service.initGame();
    const p1Pawns = new Array(12)
      .fill(null)
      .map((x, index) => {
        const pawn = new PawnModel();
        pawn.owner = PlayerType.PLAYER1;
        pawn.currentRow = 5 + Math.floor(index / 4);
        pawn.currentCol = (index % 4) * 2 + 1 - (pawn.currentRow % 2);
        pawn.type = PawnTypes.PAWN;
        return pawn;
      })

    const p2Pawns = new Array(12)
      .fill(null)
      .map((x, index) => {
        const pawn = new PawnModel();
        pawn.owner = PlayerType.PLAYER2;
        pawn.currentRow = Math.floor(index / 4);
        pawn.currentCol = (index % 4) * 2 + 1 - (pawn.currentRow % 2);
        pawn.type = PawnTypes.PAWN;
        return pawn;
      });

    expect(instance.boardState).toEqual([null, p2Pawns[0], null, p2Pawns[1], null, p2Pawns[2], null, p2Pawns[3], 
                                          p2Pawns[4], null, p2Pawns[5], null, p2Pawns[6], null, p2Pawns[7], null,
                                         null, p2Pawns[8], null, p2Pawns[9], null, p2Pawns[10], null, p2Pawns[11], 
                                         null,null,null,null,null,null,null,null,
                                         null,null,null,null,null,null,null,null,
                                         p1Pawns[0], null, p1Pawns[1], null, p1Pawns[2], null, p1Pawns[3], null,
                                         null, p1Pawns[4], null, p1Pawns[5], null, p1Pawns[6], null, p1Pawns[7], 
                                         p1Pawns[8], null, p1Pawns[9], null, p1Pawns[10], null, p1Pawns[11], null])
  });

  it('should return all the taken positions on the poard', () => {
    const service: GameManagerService = TestBed.get(GameManagerService);
    service.initGame();
    const allLocations = service.getPawnLocations();
    expect(allLocations).toEqual([
      new Position(1, 0),new Position(3, 0),new Position(5, 0),new Position(7, 0),
      new Position(0, 1),new Position(2, 1),new Position(4, 1),new Position(6, 1),
      new Position(1, 2),new Position(3, 2),new Position(5, 2),new Position(7, 2),
      new Position(0, 5),new Position(2, 5),new Position(4, 5),new Position(6, 5),
      new Position(1, 6),new Position(3, 6),new Position(5, 6),new Position(7, 6),
      new Position(0, 7),new Position(2, 7),new Position(4, 7),new Position(6, 7),
    ])
  });

  it('should notify about turn change', fakeAsync(() => {
    let counter = 0;
    let counter2 = 0;
    let counter3 = 0;
    const service: GameManagerService = TestBed.get(GameManagerService);
    const subscription = service.subscribeOnTurnChange(() => {
      counter++;
    });
    const subscription2 = service.subscribeOnTurnChange(() => {
      counter2++;
    });

    service.changeTurn();
    tick();
    expect(counter).toBe(1);
    expect(counter2).toBe(1);
    subscription.unsubscribe();
    service.changeTurn();
    tick();
    expect(counter).toBe(1);
    expect(counter2).toBe(2);
    subscription2.unsubscribe();
    service.changeTurn();
    tick();
    expect(counter).toBe(1);
    expect(counter2).toBe(2);
    const subscription3 = service.subscribeOnTurnChange(() => {
      counter3++;
    });
    service.changeTurn();
    tick(1);
    expect(counter).toBe(1);
    expect(counter2).toBe(2);
    expect(counter3).toBe(1);
    subscription3.unsubscribe();
  }))

});
