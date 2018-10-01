import {Position} from './../game-manager/position';
import {GameManagerService} from './../game-manager/game-manager.service';
import {Injectable} from '@angular/core';
import {PawnTypes} from '../game-manager/pawn-types.enum';

@Injectable({
  providedIn: 'root',
})
export class MovementManagerService {
  constructor(private gameManager: GameManagerService) {
    this.onTurnChange = this.onTurnChange.bind(this);
    this.gameManager.subscribeOnTurnChange(this.onTurnChange);
  }

  private onTurnChange() {
    this.findPawnsAvailableToMove();
  }

  private findPawnsAvailableToMove() {
    const locations: Position[] = this.gameManager.getPawnLocations();
    // const pawnsOfCurrentActivePlayer: PawnTypes[] = locations
    //   .map(i => this.gameManager.getPawnTypeAtLocation(i.x, i.y))
    //   .filter(pawnType => this.gameManager.isSelectionAllowed(pawnType));
    

  }
}
