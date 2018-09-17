import {Component, Input, ViewChild, ElementRef, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'web-checkers-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellComponent {
  @Input()
  row = 0;
  @Input()
  column = 0;
  @Input()
  isBlack = false;
  @Input()
  isWhite = false;
}
