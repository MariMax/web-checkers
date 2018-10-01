import {Position} from './../game-manager/position';
import {GameManagerService} from './../game-manager/game-manager.service';
import {Injectable} from '@angular/core';
import { PawnModel } from '../../data-structures/pawn/pawn.model';

@Injectable({
  providedIn: 'root',
})
export class MovementManagerService {
  private pawnsAvailableToMoveThisRound: PawnModel[] = [];

  constructor(private gameManager: GameManagerService) {
    this.onTurnChange = this.onTurnChange.bind(this);
    this.gameManager.subscribeOnTurnChange(this.onTurnChange);
  }

  private onTurnChange() {
    this.findPawnsAvailableToMove();
  }

  private findPawnsAvailableToMove() {
    const locations: Position[] = this.gameManager.getPawnLocations();
    const pawnsOfCurrentActivePlayer: PawnModel[] = locations
      .map(i => this.gameManager.getPawnModelAtLocation(i.x, i.y))
      .filter(pawnModel => this.gameManager.isSelectionAllowed(pawnModel));
    const movementDirection = this.gameManager.getMovementDirection();

  }
}
