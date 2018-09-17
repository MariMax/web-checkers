import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellComponent } from './cell.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'web-checkers-cell',
  template: '<ng-content></ng-content>',
})
export class CellComponentMock extends CellComponent {
}

@Component({
  template: `<web-checkers-cell [isBlack]="isBlack" [isWhite]="isWhite"></web-checkers-cell>`
})
class HostComponent {
  isBlack = false;
  isWhite = false;
}

describe('CellComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellComponent, HostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('should create', () => {
    const cell = fixture.debugElement.query(By.css('web-checkers-cell'))
    expect(cell).toBeTruthy();
  });

  it('should be black when host component says black', () => {
    fixture.componentInstance.isBlack = true;
    fixture.detectChanges();
    const cellDiv = fixture.debugElement.query(By.css('web-checkers-cell > div'))
    const cell = fixture.debugElement.query(By.css('web-checkers-cell'))
    expect(cellDiv.nativeElement.classList.contains('black')).toBeTruthy();
  });

  it('should be white when host component says white', () => {
    fixture.componentInstance.isWhite = true;
    fixture.detectChanges();
    const cellDiv = fixture.debugElement.query(By.css('web-checkers-cell > div'))
    expect(cellDiv.nativeElement.classList.contains('white')).toBeTruthy();
  });

});
