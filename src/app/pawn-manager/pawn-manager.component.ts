import { HALF_BOARD_SIZE, GameManagerService } from './../services/game-manager/game-manager.service';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  HostBinding,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import {Pawn} from '../data-structures/pawn/pawn';
import { MAX_NUMBER_OF_PAWNS } from '../services/game-manager/game-manager.service';
import { PawnTypes } from '../services/game-manager/pawn-types.enum';

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
  private selectedPawn: Pawn = null;

  constructor(private gameManager: GameManagerService,
              private changeDetector: ChangeDetectorRef) {
  }

  private adjustPawnPosition(pawn: Pawn): Pawn {
    const col = pawn.currentCol;
    const row = pawn.currentRow;
    const left = parseFloat(this.size) * col;
    const top = parseFloat(this.size) * row;
    pawn.left = `${left}px`;
    pawn.top = `${top}px`;
    return pawn;
  }

  ngOnInit() {
    const locations = this.gameManager.getPawnLocations();
    this.pawns = locations
    .map(i => {
      const type = this.gameManager.getPawnTypeAtLocation(i.x, i.y);
      if (type === PawnTypes.NONE) {
        return null;
      }
      const pawn = new Pawn();
      pawn.color = [PawnTypes.PL1_PAWN, PawnTypes.PL1_QUEEN].includes(type) ? 'white' : 'black';
      pawn.currentCol = i.x;
      pawn.currentRow = i.y;
      pawn.type = type;
      return this.adjustPawnPosition(pawn);
    })
    .filter(i => i !== null);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.size && !simpleChanges.size.firstChange) {
      this.pawns.forEach(i => this.adjustPawnPosition(i));
    }
  }

  @HostListener('click', ['$event'])
  private onClick(event: MouseEvent) {
    const col = Math.floor(event.offsetX / parseFloat(this.size));
    const row = Math.floor(event.offsetY / parseFloat(this.size));
    const pawnType = this.gameManager.getPawnTypeAtLocation(col, row);
    if (pawnType !== PawnTypes.NONE && this.gameManager.isSelectionAllowed(pawnType)) {
      this.selectedPawn = this.pawns.find(i => i.type === pawnType && i.currentCol === col && i.currentRow === row);
      this.changeDetector.detectChanges();
      return;
    }
    this.selectedPawn = null;
    console.log(col, row, pawnType);
    this.changeDetector.detectChanges();
  }

  public isSelected(pawn: Pawn) {
    return this.selectedPawn === pawn;
  }
}
