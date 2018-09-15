import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellComponent } from './cell.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  template: `<web-checkers-cell [row]="row" [column]="column"><span *ngIf="showChild"></span></web-checkers-cell>`
})
class HostComponent {
  showChild = false;
  row = 0;
  column = 0;
}

describe('CellComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ CellComponent, HostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const cell = fixture.debugElement.query(By.css('web-checkers-cell'))
    expect(cell).toBeTruthy();
  });

  it('should be black when have children', () => {
    fixture.componentInstance.row = 3;
    fixture.componentInstance.column = 4;
    fixture.componentInstance.showChild = true;
    fixture.detectChanges();
    const cellDiv = fixture.debugElement.query(By.css('web-checkers-cell > div'))
    const cell = fixture.debugElement.query(By.css('web-checkers-cell'))
    expect(cellDiv.nativeElement.classList.contains('black')).toBeTruthy();
    expect(cell.componentInstance.isBorder).toBeTruthy();
  });

  it('should be black when column 0 or 9', () => {
    fixture.componentInstance.row = 3;
    fixture.componentInstance.column = 0;
    fixture.componentInstance.showChild = false;
    fixture.detectChanges();
    const cellDiv = fixture.debugElement.query(By.css('web-checkers-cell > div'))
    const cell = fixture.debugElement.query(By.css('web-checkers-cell'))
    expect(cellDiv.nativeElement.classList.contains('black')).toBeTruthy();
    expect(cell.componentInstance.isBorder).toBeTruthy();
    fixture.componentInstance.column = 9;
    expect(cellDiv.nativeElement.classList.contains('black')).toBeTruthy();
    expect(cell.componentInstance.isBorder).toBeTruthy();
  });

  it('should be black when row + column % 2 === 0', () => {
    fixture.componentInstance.row = 4;
    fixture.componentInstance.column = 4;
    fixture.componentInstance.showChild = false;
    fixture.detectChanges();
    const cellDiv = fixture.debugElement.query(By.css('web-checkers-cell > div'))
    const cell = fixture.debugElement.query(By.css('web-checkers-cell'))
    expect(cellDiv.nativeElement.classList.contains('black')).toBeTruthy();
    expect(cell.componentInstance.isBorder).toBeFalsy();
  });

  it('should be white when not on border and row + column % 2 !== 0', () => {
    fixture.componentInstance.row = 4;
    fixture.componentInstance.column = 5;
    fixture.componentInstance.showChild = false;
    fixture.detectChanges();
    const cellDiv = fixture.debugElement.query(By.css('web-checkers-cell > div'))
    const cell = fixture.debugElement.query(By.css('web-checkers-cell'))
    expect(cellDiv.nativeElement.classList.contains('white')).toBeTruthy();
    expect(cell.componentInstance.isBorder).toBeFalsy();
  });

});
