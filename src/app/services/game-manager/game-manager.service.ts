import {ActivePlayer} from './active-player.enum';
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
  private boardState: PawnTypes[] = [];
  private turnChange = new Subject<void>();
  private activePlayer: ActivePlayer;
  private timer: Observable<number>;
  private timerSubscription = new Subscription();
  private allSubscriptions: Subscription[] = [];

  constructor() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.boardState.push(PawnTypes.NONE);
      }
    }
    this.activePlayer = ActivePlayer.PLAYER1;
  }

  public isSelectionAllowed(pawnType: PawnTypes): boolean {
    if (this.activePlayer === ActivePlayer.PLAYER1) {
      return (
        pawnType === PawnTypes.PL1_PAWN || pawnType === PawnTypes.PL1_QUEEN
      );
    }
    //this is PLAYER2
    return pawnType === PawnTypes.PL2_PAWN || pawnType === PawnTypes.PL2_QUEEN;
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

  public subscribeOnTurnChange(fn: () => void): Subscription {
    if (!this.timer || this.timerSubscription.closed) {
      this.timerSubscription = new Subscription();
      this.timer = timer(0, 2000);
      this.timerSubscription.add(this.timer.subscribe(() => this.turnChange.next()));
    }
    const s = this.timer.subscribe(fn);
    this.allSubscriptions.push(s);
    const s2 = this.timerSubscription.add(() => {
      s.unsubscribe();
      this.timerSubscription.remove(s2);
      this.allSubscriptions = this.allSubscriptions.filter(i => i !== s);
      if (this.allSubscriptions.length === 0) {
        this.timerSubscription.unsubscribe();
      }
    });
    return s2;
  }
}
