import {Subscription} from 'rxjs';
import {PawnModel} from './../data-structures/pawn/pawn.model';
import {PawnComponentBase} from './../data-structures/pawn-component-base/pawn-component.base';
import {PlayerType} from './../services/game-manager/active-player.enum';
import {GameManagerService} from './../services/game-manager/game-manager.service';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  HostListener,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import {Position} from '../services/game-manager/position';
import {MovementManagerService} from '../services/movement-manager/movement-manager.service';

@Component({
  selector: 'web-checkers-pawn-manager',
  templateUrl: './pawn-manager.component.html',
  styleUrls: ['./pawn-manager.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PawnManagerComponent implements OnInit, OnChanges, OnDestroy {
  private movementCalcularedSubscrition: Subscription;
  private pawnAllowedToMove: PawnModel[] = [];
  private _size = '100px';
  @Input()
  public set size(value: string) {
    this._size = value;
  }
  public get size(): string {
    return this._size;
  }

  public pawns: PawnComponentBase[] = [];
  private selectedPawn: PawnComponentBase = null;

  constructor(
    private gameManager: GameManagerService,
    private movementManager: MovementManagerService,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.onCalcAvailableMovesCompleted = this.onCalcAvailableMovesCompleted.bind(
      this,
    );
  }

  private adjustPawnPosition(pawn: PawnComponentBase): PawnComponentBase {
    const col = pawn.currentCol;
    const row = pawn.currentRow;
    const left = parseFloat(this.size) * col;
    const top = parseFloat(this.size) * row;
    pawn.left = `${left}px`;
    pawn.top = `${top}px`;
    return pawn;
  }

  ngOnInit() {
    const locations: Position[] = this.gameManager.getPawnLocations();
    this.movementCalcularedSubscrition = this.movementManager.subscribeOnCompleteMovesCalculation(
      this.onCalcAvailableMovesCompleted,
    );
    this.pawns = locations
      .map(i => {
        const pawn = this.gameManager.getPawnModelAtLocation(i);
        if (pawn === null) {
          return null;
        }

        const basePawn = {...pawn} as PawnComponentBase;
        basePawn.color = pawn.owner === PlayerType.PLAYER1 ? 'white' : 'black';

        return this.adjustPawnPosition(basePawn);
      })
      .filter(i => i !== null);
  }

  ngOnDestroy() {
    if (this.movementCalcularedSubscrition) {
      this.movementCalcularedSubscrition.unsubscribe();
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.size && !simpleChanges.size.firstChange) {
      this.pawns.forEach(i => this.adjustPawnPosition(i));
    }
  }

  private onCalcAvailableMovesCompleted(pawnsAllowedToMove: PawnModel[]) {
    this.pawnAllowedToMove = pawnsAllowedToMove;
    this.selectedPawn = null;
    this.changeDetector.detectChanges();
  }

  @HostListener('click', ['$event'])
  private onClick(event: MouseEvent) {
    const col = Math.floor(event.offsetX / parseFloat(this.size));
    const row = Math.floor(event.offsetY / parseFloat(this.size));
    const pawnModel = this.gameManager.getPawnModelAtLocation(
      new Position(col, row),
    );
    if (
      pawnModel &&
      this.gameManager.isSelectionAllowed(pawnModel) &&
      this.pawnAllowedToMove.includes(pawnModel)
    ) {
      this.selectedPawn = this.pawns.find(
        i =>
          i.type === pawnModel.type &&
          i.currentCol === col &&
          i.currentRow === row,
      );
      this.changeDetector.detectChanges();
      return;
    }
    this.selectedPawn = null;
    this.changeDetector.detectChanges();
  }

  public isSelected(pawn: PawnComponentBase): boolean {
    return this.selectedPawn === pawn;
  }

  public isAvailableToMove(item: PawnComponentBase): boolean {
    const pawn = this.gameManager.getPawnModelAtLocation(
      new Position(item.currentCol, item.currentRow),
    );
    return this.pawnAllowedToMove.includes(pawn);
  }
}
