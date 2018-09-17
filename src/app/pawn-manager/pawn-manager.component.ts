import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Pawn } from '../data-structures/pawn/pawn';

@Component({
  selector: 'web-checkers-pawn-manager',
  templateUrl: './pawn-manager.component.html',
  styleUrls: ['./pawn-manager.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PawnManagerComponent implements OnInit {
  private _size = '100px';
  @Input()
  public set size(value: string) {
    this._size = value;
  }
  public get size(): string {
    return this._size;
  }

  public blackItems: Pawn[] = [];

  ngOnInit() {
    for(let i = 0; i < 12; i++) {
      const pawn = new Pawn();
      pawn.color = 'black';
      const row = (i / 4) | 0;
      const left = parseFloat(this.size)*((i%4) * 2 + 1 - row % 2);
      pawn.left = `${left}px`;
      const top = parseFloat(this.size) * ( row )
      pawn.top = `${top}px`;
      this.blackItems.push(pawn);
    }
  }
}
