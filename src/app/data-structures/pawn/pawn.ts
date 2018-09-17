import { Input } from "@angular/core";

export class Pawn {
  @Input() color = 'white';
  @Input() left = '0%';
  @Input() top = '0%';
}
