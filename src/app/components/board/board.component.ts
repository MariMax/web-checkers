import {CellComponent} from './../cell/cell.component';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChildren,
  AfterViewInit,
  QueryList,
  ElementRef,
  ChangeDetectorRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'web-checkers-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements AfterViewInit {
  @ViewChildren(CellComponent, {read: ElementRef})
  cellsInstances: QueryList<ElementRef>;

  public alphabet = ' abcdefgh ';
  public topRow = new Array(10);
  public cells = new Array(80);
  public size: string = null;

  constructor(
    private changeDetector: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private _platformId: Object,
  ) {}

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

  public isBlack(index): boolean {
    const row = this.getRow(index);
    const column = this.getColumn(index);
    if (column === 0 || column === 9) return false;
    return (row + column) % 2 === 0;
  }

  public isWhite(index): boolean {
    return !this.isBlack(index);
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this._platformId)) return;
    const first = this.cellsInstances.first.nativeElement.getBoundingClientRect();
    let dimentions;
    const biggest = this.cellsInstances.find((i: ElementRef) => {
      dimentions = i.nativeElement.getBoundingClientRect();
      return first.width < dimentions.width && first.height < dimentions.height;
    });
    this.size = `${dimentions.width}px`;
    this.changeDetector.detectChanges();
  }
}
