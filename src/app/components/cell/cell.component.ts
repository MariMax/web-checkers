import {Component, Input, ViewChild, ElementRef, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'web-checkers-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellComponent {
  @Input()
  row: number = 0;
  @Input()
  column: number = 0;

  @ViewChild('wrapper')
  wrapper: ElementRef<HTMLDivElement>;

  get isBorder(): boolean {
    return (
      this.column === 0 ||
      this.column === 9 ||
      this.wrapper.nativeElement.children.length > 0
    );
  }

  get isBlack(): boolean {
    return this.isBorder || (this.row + this.column) % 2 === 0;
  }

  get isWhite(): boolean {
    return !this.isBorder && (this.row + this.column) % 2 !== 0;
  }
}
