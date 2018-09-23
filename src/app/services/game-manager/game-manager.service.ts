import {Injectable} from '@angular/core';
import {PawnTypes} from './pawn-types.enum';
import {Position} from './position';

export const BOARD_SIZE = 8;
export const HALF_BOARD_SIZE = 4;
export const MAX_NUMBER_OF_PAWNS = 12;

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private boardState: PawnTypes[] = [];

  constructor() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.boardState.push(PawnTypes.NONE);
      }
    }
  }

  public isSelectionAllowed() {
    return true;
  }

  public getPawnTypeAtLocation(x: number, y: number): PawnTypes {
    return this.boardState[y * BOARD_SIZE + x];
  }

  public initGame() {
    this.generateDefaultStateForBoard();
  }

  private generateDefaultStateForType(startRow: number, type: PawnTypes) {
    for (let i = 0; i < MAX_NUMBER_OF_PAWNS; i++) {
      const row = Math.floor(i / HALF_BOARD_SIZE) + startRow;
      const column = (i % HALF_BOARD_SIZE) * 2 + 1 - (row % 2);
      this.boardState[row * BOARD_SIZE + column] = type;
    }
  }

  private generateDefaultStateForBoard() {
    this.generateDefaultStateForType(0, PawnTypes.PL2_PAWN);
    this.generateDefaultStateForType(5, PawnTypes.PL1_PAWN);
  }

  private get2dFromIndex(i: number): Position {
    return {y: Math.floor(i / BOARD_SIZE), x: i % BOARD_SIZE};
  }

  public getPawnLocations(): Position[] {
    return this.boardState
      .map((i, index) => {
        if (i !== PawnTypes.NONE) return this.get2dFromIndex(index);
        return null;
      })
      .filter(i => i !== null);
  }
}
