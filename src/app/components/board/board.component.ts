import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'web-checkers-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  public alphabet = ' abcdefgh ';
  public topRow = new Array(10);
  public cells = new Array(80);

  public getRow(index: number): number {
    return Math.floor(index / 10) % 10;
  }

  public getColumn(index: number): number {
    return index % 10;
  }

  public getText(index: number): string {
    const column = this.getColumn(index);
    const row = this.getRow(index);
    if (column === 0 || column === 9) {
      return `${8 - row}`;
    }
    return '';
  }
}
