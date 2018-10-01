import {Input} from '@angular/core';
import {PawnModel} from '../pawn/pawn.model';
export class PawnComponentBase extends PawnModel {
  @Input()
  color = 'white';
  @Input()
  left = '0%';
  @Input()
  top = '0%';
}
