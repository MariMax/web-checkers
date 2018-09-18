import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {Pawn} from '../data-structures/pawn/pawn';

@Component({
  selector: 'web-checkers-pawn-manager',
  templateUrl: './pawn-manager.component.html',
  styleUrls: ['./pawn-manager.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PawnManagerComponent implements OnInit, OnChanges {
  private _size = '100px';
  @Input()
  public set size(value: string) {
    this._size = value;
  }
  public get size(): string {
    return this._size;
  }

  public pawns: Pawn[] = [];

  private adjustPawnPosition(pawn: Pawn): Pawn {
    const col = pawn.currentCol;
    const row = pawn.currentRow;
    const left = parseFloat(this.size) * col;
    const top = parseFloat(this.size) * row;
    pawn.left = `${left}px`;
    pawn.top = `${top}px`;
    return pawn;
  }

  private createPawn(color: string, row: number, col: number) {
    const pawn = new Pawn();
    pawn.color = color;
    pawn.currentCol = col;
    pawn.currentRow = row;
    return this.adjustPawnPosition(pawn);
  }

  private generateDefaultState(startRow: number, color: string): Pawn[] {
    const pawns: Pawn[] = [];
    for (let i = 0; i < 12; i++) {
      const row = (Math.floor(i / 4)) + startRow;
      const column = (i % 4) * 2 + 1 - (row % 2);
      pawns.push(this.createPawn(color, row, column));
    }

    return pawns;
  }

  ngOnInit() {
    this.pawns = [
      ...this.generateDefaultState(0, 'black'),
      ...this.generateDefaultState(5, 'white'),
    ];
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.size && !simpleChanges.size.firstChange) {
      this.pawns.forEach(i => this.adjustPawnPosition(i));
    }
  }
}
