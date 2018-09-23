import { Input } from '@angular/core';
import { PawnTypes } from '../../services/game-manager/pawn-types.enum';

export class Pawn {
  @Input() color = 'white';
  @Input() left = '0%';
  @Input() top = '0%';
  type: PawnTypes;
  currentCol: number;
  currentRow: number;
}
