import {
  Component,
  Renderer2,
  ViewChild,
  ElementRef,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
} from '@angular/core';
import {Pawn} from '../data-structures/pawn/pawn';

@Component({
  selector: 'web-checkers-pawn',
  templateUrl: './pawn.component.html',
  styleUrls: ['./pawn.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PawnComponent extends Pawn implements OnChanges {
  @Input()
  isSelected = false;
  @Input()
  isAvailableToMove = false;
  @Input()
  size = '100px';

  private get pawnColor(): string {
    return `#wave-${this.color}`;
  }

  @ViewChild('pawn')
  pawn: ElementRef<HTMLDivElement>;

  constructor(private renderer: Renderer2) {
    super();
  }

  ngOnChanges() {
    this.renderer.setProperty(
      this.pawn.nativeElement,
      'style',
      `--size: ${this.size}; --left: ${this.left}; --top: ${this.top}`,
    );
  }

  public getTint() {
    if (this.isSelected) {
      return `#wave-blue`;
    }
    if (this.isAvailableToMove) {
      return `#wave-green`;
    }

    return this.pawnColor;
  }
}
