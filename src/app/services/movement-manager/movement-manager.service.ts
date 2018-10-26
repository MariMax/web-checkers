import {
  GameManagerService,
  BOARD_SIZE,
} from './../game-manager/game-manager.service';
import {Injectable} from '@angular/core';
import {PawnModel} from '../../data-structures/pawn/pawn.model';
import {MovementType} from './movement-type.enum';
import {PawnTypes} from '../game-manager/pawn-types.enum';
import {Position} from '../game-manager/position';
import { Subscription, Subject } from 'rxjs';

interface AvailableMove {
  pawn: PawnModel;
  position: Position;
  type: MovementType;
}

const PAWN_DISTANCE = 1;
const QUEEN_DISTANCE = 10;

@Injectable({
  providedIn: 'root',
})
export class MovementManagerService {
  private pawnsAvailableToMoveThisRound: PawnModel[] = [];
  private availableMoves: AvailableMove[][] = [];
  private movesCalculated = new Subject<PawnModel[]>();
  private movesReadySubscription: Subscription;

  constructor(private gameManager: GameManagerService) {
    this.onTurnChange = this.onTurnChange.bind(this);
    this.gameManager.subscribeOnTurnChange(this.onTurnChange);
  }

  private onTurnChange() {
    this.availableMoves = [];
    this.findPawnsAvailableToMove();
  }

  private findPawnsAvailableToMove() {
    const locations: Position[] = this.gameManager.getPawnLocations();
    const pawnsOfCurrentActivePlayer: PawnModel[] = locations
      .map(i => this.gameManager.getPawnModelAtLocation(i))
      .filter(pawnModel => this.gameManager.isSelectionAllowed(pawnModel));
    const movementDirection = this.gameManager.getMovementDirection();
    const availableMoves: AvailableMove[][] = pawnsOfCurrentActivePlayer
      .map(pawn => {
        return this.findAvailableMoveForPawnFromLocation(
          pawn,
          movementDirection,
        );
      })
      .reduce((result: AvailableMove[][], moves: AvailableMove[][]) => {
        return [...result, ...moves];
      }, []);

    const attackMoves: AvailableMove[][] = availableMoves.reduce(
      (result: AvailableMove[][], current: AvailableMove[]) => {
        const isAttackMove = current.some(i => i.type === MovementType.ATTACK);
        return isAttackMove ? [...result, current] : result;
      },
      [],
    );
    if (attackMoves.length) {
      // when we have many attack moves, we should pick longest moves
      let maxLength = 0;
      for (let i = 0; i < attackMoves.length; i++) {
        if (attackMoves.length >= maxLength) {
          maxLength = attackMoves.length;
        }
      }
      this.availableMoves = attackMoves.filter(i => i.length === maxLength);
    }
    // if we don't have attack moves, we allow all available moves;
    if (this.availableMoves.length === 0) {
      this.availableMoves = availableMoves;
    }

    this.pawnsAvailableToMoveThisRound = this.availableMoves.map(
      i => i[0].pawn,
    ).filter((i, index, self) => self.indexOf(i) === index);

    this.movesCalculated.next([...this.pawnsAvailableToMoveThisRound]);
  }

  private findAvailableMoveForPawnFromLocation(
    pawn: PawnModel,
    direction: number,
  ): AvailableMove[][] {
    if (pawn.type === PawnTypes.PAWN) {
      return this.findAvailableMoveForSimplePawn(pawn, direction);
    }

    return this.findAvailableMoveForQueen(pawn);
  }

  private findAvailableMoveForSimplePawn(
    pawn: PawnModel,
    direction: number,
  ): AvailableMove[][] {
    const pawnPosition = new Position(pawn.currentCol, pawn.currentRow);
    return [
      ...this.checkDirection(pawn, pawnPosition, 1, 1, PAWN_DISTANCE, []),
      ...this.checkDirection(pawn, pawnPosition, 1, -1, PAWN_DISTANCE, []),
      ...this.checkDirection(pawn, pawnPosition, -1, 1, PAWN_DISTANCE, []),
      ...this.checkDirection(pawn, pawnPosition, -1, -1, PAWN_DISTANCE, []),
    ].filter((movementQueue: AvailableMove[]) => {
      if (
        movementQueue.length >= 2 &&
        movementQueue[1].type === MovementType.MOVE
      ) {
        // just a move, not an attack, it should be in the forward direction
        const newPosition = movementQueue[1].position;
        const moveDirection = newPosition.y - pawnPosition.y;
        return moveDirection === direction;
      }
      return true;
    });
  }

  private findAvailableMoveForQueen(pawn: PawnModel): AvailableMove[][] {
    const pawnPosition = new Position(pawn.currentCol, pawn.currentRow);
    return [
      ...this.checkDirection(pawn, pawnPosition, 1, 1, QUEEN_DISTANCE, []),
      ...this.checkDirection(pawn, pawnPosition, 1, -1, QUEEN_DISTANCE, []),
      ...this.checkDirection(pawn, pawnPosition, -1, 1, QUEEN_DISTANCE, []),
      ...this.checkDirection(pawn, pawnPosition, -1, -1, QUEEN_DISTANCE, []),
    ]
  }

  private isCellBeyoundTheBoard(location: Position) {
    return (
      location.x >= BOARD_SIZE ||
      location.y >= BOARD_SIZE ||
      location.x < 0 ||
      location.y < 0
    );
  }

  private addMove(
    pawn: PawnModel,
    startLocation: Position,
    newLocation: Position,
    movementType: MovementType,
    prevPath: AvailableMove[],
  ): AvailableMove[] {
    let newPath: AvailableMove[] = [];
    if (prevPath.length === 0) {
      newPath = [
        {pawn, position: startLocation, type: MovementType.MOVE},
        {pawn, position: newLocation, type: movementType},
      ];
    } else {
      newPath = [
        ...prevPath,
        {pawn, position: newLocation, type: movementType},
      ];
    }
    return newPath;
  }

  private checkDirection(
    pawn: PawnModel,
    startPosition: Position,
    directionX: number,
    directionY: number,
    length: number,
    path: AvailableMove[],
  ): AvailableMove[][] {
    const availableMoves: AvailableMove[][] = [];
    for (let i = 1; i <= length; i++) {
      const newLocation = new Position(
        startPosition.x + i * directionX,
        startPosition.y + i * directionY,
      );

      // beyond the board, dont care, we cannot exit the board
      if (this.isCellBeyoundTheBoard(newLocation)) {
        continue;
      }

      const pawnAtNewPosition = this.gameManager.getPawnModelAtLocation(
        newLocation,
      );
      // empty spot found, we do not attack
      if (!pawnAtNewPosition) {
        const newPath = this.addMove(
          pawn,
          startPosition,
          newLocation,
          MovementType.MOVE,
          path,
        );
        availableMoves.push(newPath);
        continue;
      }
      // found enemy and next cell is empty and on board, then it's an atack move
      if (pawnAtNewPosition.owner !== pawn.owner) {
        const nextCellInTheSameDirection = new Position(
          newLocation.x + directionX,
          newLocation.y + directionY,
        );

        if (this.didWeTakeThisPawn(pawnAtNewPosition, path)) {
          // can't attack, enemy pawn already taken, doesn't make any sence to continue
          break;
        }

        if (this.isCellBeyoundTheBoard(nextCellInTheSameDirection)) {
          // can't attack, enemy pawn on the end of the board
          break;
        }

        const pawnOnTheNextCell = this.gameManager.getPawnModelAtLocation(
          nextCellInTheSameDirection,
        );
        if (pawnOnTheNextCell) {
          // can't attack, enemy pawn supported by someone else
          break;
        }

        // can attack!!!
        const newPath = this.addMove(
          pawn,
          startPosition,
          nextCellInTheSameDirection,
          MovementType.ATTACK,
          path,
        );
        availableMoves.push(newPath);
        // if pawn is queen, it can land on any cell behind the pawnAtNewPosition
        if (pawn.type === PawnTypes.QUEEN) {
          this.addAllPossibleMovesForQueenAfterTakenPawn(
            pawn,
            startPosition,
            nextCellInTheSameDirection,
            path,
            directionX,
            directionY,
          ).forEach(p => availableMoves.push(p));
        }
      }
    }

    return availableMoves;
  }

  private didWeTakeThisPawn(pawn: PawnModel, path: AvailableMove[]): boolean {
    if (path.length < 2) {
      return false;
    }

    if (path.every(i => i.type === MovementType.MOVE)) {
      return false;
    }

    for (let i = 1; i < path.length; i++) {
      if (
        this.isPositionBetweenOthers(
          new Position(pawn.currentCol, pawn.currentRow),
          path[i - 1].position,
          path[i].position,
        )
      ) {
        return true;
      }
    }

    return false;
  }

  private isPositionBetweenOthers(
    position: Position,
    first: Position,
    second: Position,
  ): boolean {
    const diff = Math.abs(first.x - second.x);
    const directionX = Math.floor((first.x - second.x) / diff);
    const directionY = Math.floor((first.y - second.y) / diff);
    return new Array(diff)
      .fill(null)
      .map(
        (i, index) =>
          new Position(
            first.x + index * directionX,
            first.y + index * directionY,
          ),
      )
      .some(i => i.isEqual(position));
  }

  private addAllPossibleMovesForQueenAfterTakenPawn(
    pawn: PawnModel,
    startLocation: Position,
    firstAvailableLocation: Position,
    prevPath: AvailableMove[],
    directionX: number,
    directionY: number,
  ): AvailableMove[][] {
    let i = 1;
    let isLocationOnBoard = false;
    let isLocationFree = false;
    const availableMoves: AvailableMove[][] = [];
    do {
      const newLocation = new Position(
        firstAvailableLocation.x + i * directionX,
        firstAvailableLocation.y + i * directionY,
      );
      isLocationFree = !!this.gameManager.getPawnModelAtLocation(newLocation);
      isLocationOnBoard = !this.isCellBeyoundTheBoard(newLocation);
      if (isLocationFree && isLocationOnBoard) {
        const newPath = this.addMove(
          pawn,
          startLocation,
          newLocation,
          MovementType.ATTACK,
          prevPath,
        );
        availableMoves.push(newPath);
      } else {
        break;
      }
      i++;
    } while (true);

    return availableMoves;
  }

  public subscribeOnCompleteMovesCalculation(fn: (pawns: PawnModel[]) => void): Subscription {
    if (!this.movesReadySubscription || this.movesReadySubscription.closed) {
      this.movesReadySubscription = new Subscription();
    }
    const s = this.movesCalculated.subscribe(fn);
    return this.movesReadySubscription.add(() => {
      s.unsubscribe();
      if (this.movesCalculated.observers.length === 0) {
        this.movesReadySubscription.unsubscribe();
      }
    });
  }

  public getAvailableMovesForPawn(pawn: PawnModel): AvailableMove[][] {
    return this.availableMoves.filter(moves => {
      return moves[0].pawn === pawn;
    });
  }
}
