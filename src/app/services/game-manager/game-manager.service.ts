import { PawnModel } from './../../data-structures/pawn/pawn.model';
import {PlayerType} from './active-player.enum';
import {Injectable} from '@angular/core';
import {PawnTypes} from './pawn-types.enum';
import {Position} from './position';
import {Subject, Subscription, timer, Observable, PartialObserver} from 'rxjs';

export const BOARD_SIZE = 8;
export const HALF_BOARD_SIZE = 4;
export const MAX_NUMBER_OF_PAWNS = 12;

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private boardState: PawnModel[] = [];
  private turnChange = new Subject<void>();
  private activePlayer: PlayerType;
  private timerSubscription: Subscription;

  constructor() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.boardState.push(null);
      }
    }
    this.activePlayer = PlayerType.PLAYER1;
  }

  public isSelectionAllowed(pawnModel: PawnModel): boolean {
    return this.activePlayer === pawnModel.owner;
  }

  public getMovementDirection(): number {
    return this.activePlayer === PlayerType.PLAYER1 ? -1 : 1;
  }

  public getPawnModelAtLocation(x: number, y: number): PawnModel {
    return this.boardState[y * BOARD_SIZE + x];
  }

  public initGame() {
    this.generateDefaultStateForBoard();
  }

  private generateDefaultStateForType(startRow: number, player: PlayerType) {
    for (let i = 0; i < MAX_NUMBER_OF_PAWNS; i++) {
      const row = Math.floor(i / HALF_BOARD_SIZE) + startRow;
      const column = (i % HALF_BOARD_SIZE) * 2 + 1 - (row % 2);
      const pawnModel = new PawnModel();
      pawnModel.currentCol = column;
      pawnModel.currentRow = row;
      pawnModel.owner = player;
      pawnModel.type = PawnTypes.PAWN;
      this.boardState[row * BOARD_SIZE + column] = pawnModel;
    }
  }

  private generateDefaultStateForBoard() {
    this.generateDefaultStateForType(0, PlayerType.PLAYER2);
    this.generateDefaultStateForType(5, PlayerType.PLAYER1);
  }

  private get2dFromIndex(i: number): Position {
    return {y: Math.floor(i / BOARD_SIZE), x: i % BOARD_SIZE};
  }

  public getPawnLocations(): Position[] {
    return this.boardState
      .map((i, index) => {
        if (i !== null) {
          return this.get2dFromIndex(index);
        }
        return null;
      })
      .filter(i => i !== null);
  }

  public subscribeOnTurnChange(fn: () => void): Subscription {
    if (!this.timerSubscription || this.timerSubscription.closed) {
      this.timerSubscription = new Subscription();
      this.timerSubscription.add(timer(0, 2000).subscribe(() => this.turnChange.next()));
    }
    const s = this.turnChange.subscribe(fn);
    return this.timerSubscription.add(() => {
      s.unsubscribe();
      if (this.turnChange.observers.length === 0) {
        this.timerSubscription.unsubscribe();
      }
    });
  }
}
