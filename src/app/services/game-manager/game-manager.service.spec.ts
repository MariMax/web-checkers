import { PawnTypes } from './pawn-types.enum';
import { TestBed } from '@angular/core/testing';

import { GameManagerService, BOARD_SIZE } from './game-manager.service';

describe('GameManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

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

  it('should always allow selection', () => {
    const service: GameManagerService = TestBed.get(GameManagerService);
    expect(service.isSelectionAllowed(PawnTypes.NONE)).toBeTruthy();
    expect(service.isSelectionAllowed(PawnTypes.PL1_PAWN)).toBeTruthy();
    expect(service.isSelectionAllowed(PawnTypes.PL1_QUEEN)).toBeTruthy();
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


});
