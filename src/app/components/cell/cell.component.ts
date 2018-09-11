import { Component, Input } from '@angular/core';

@Component({
  selector: 'web-checkers-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent {
  @Input() row: number;
  @Input() column: number;
}
