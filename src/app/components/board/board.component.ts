import {CellComponent} from './../cell/cell.component';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChildren,
  AfterViewInit,
  QueryList,
  ElementRef,
  ChangeDetectorRef,
  Inject,
  OnDestroy,
} from '@angular/core';
import {WINDOW} from '../../services/window-injector/window-injector.service';
import {PlatformService} from '../../services/platform/platform.service';
import {Subscription, fromEvent} from 'rxjs';
import {throttleTime} from 'rxjs/operators';

@Component({
  selector: 'web-checkers-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements AfterViewInit, OnDestroy {
  @ViewChildren(CellComponent, {read: ElementRef})
  cellsInstances: QueryList<ElementRef>;

  public alphabet = ' abcdefgh ';
  public topRow = new Array(10);
  public cells = new Array(80);
  public size: string = null;
  private resizeSubscription: Subscription;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private platformService: PlatformService,
    @Inject(WINDOW) private window: Window,
  ) {
    this.resizeHandler = this.resizeHandler.bind(this);
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

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
    if (column === 0 || column === 9) {
      return false;
    }
    return (row + column) % 2 === 0;
  }

  public isWhite(index): boolean {
    return !this.isBlack(index);
  }

  ngAfterViewInit() {
    if (!this.platformService.isBrowser) {
      return;
    }
    this.resizeHandler();
    this.resizeSubscription = fromEvent(this.window, 'resize')
      .pipe(throttleTime(50))
      .subscribe(this.resizeHandler);
  }

  private resizeHandler() {
    this.calcCellDimentions();
  }

  private calcCellDimentions() {
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
