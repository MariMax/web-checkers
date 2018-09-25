import { GameManagerService } from './../game-manager/game-manager.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
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
    
  }
}
