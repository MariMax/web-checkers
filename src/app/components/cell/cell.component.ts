import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'web-checkers-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellComponent {
  @Input()
  isBlack = false;
  @Input()
  isWhite = false;
}
