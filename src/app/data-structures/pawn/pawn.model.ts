import { PlayerType } from '../../services/game-manager/active-player.enum';
import { Input } from '@angular/core';
import { PawnTypes } from '../../services/game-manager/pawn-types.enum';

export class PawnModel {
  type: PawnTypes;
  owner: PlayerType;
  currentCol: number;
  currentRow: number;
}
