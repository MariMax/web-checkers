import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PawnComponent } from './pawn.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'web-checkers-pawn',
  template: '<!-- empty --> ',
})
export class PawnComponentMock extends PawnComponent {
  ngOnChanges() {}
}

@Component({
  template: `<web-checkers-pawn 
                [size]="size" 
                [top]="top" 
                [left]="left"
                [color]="color"
                [isSelected]="isSelected"
                [isAvailableToMove]="isAvailableToMove"
                ></web-checkers-pawn>`,
})
class HostComponent {
  public size = '200px';
  public top = '0%';
  public left = '0%';
  public color = 'black';
  public isSelected = false;
  public isAvailableToMove = false;
}


describe('PawnComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PawnComponent, HostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('should create', () => {
    expect(fixture).toBeTruthy();
    const pawn = fixture.debugElement.query(By.css('web-checkers-pawn'));
    expect(pawn).not.toBeNull();
    expect(pawn.componentInstance).toBeDefined();
  });

  it('should create set style params passed from host element', async () => {
    expect(fixture).toBeTruthy();
    const pawn = fixture.debugElement.query(By.css('web-checkers-pawn'));
    expect(pawn).not.toBeNull();
    expect(pawn.componentInstance).toBeDefined();
    fixture.componentInstance.left = '10px';
    fixture.componentInstance.top = '15px';
    fixture.componentInstance.size = '20px';
    await fixture.detectChanges();
    expect(pawn.componentInstance.pawn.nativeElement.style.cssText).toBe('--size: 20px; --left: 10px; --top: 15px;');
  });

  it('should have blue tint when selected', async () => {
    expect(fixture).toBeTruthy();
    fixture.componentInstance.isSelected = true;
    await fixture.detectChanges();
    const pawn = fixture.debugElement.query(By.css('web-checkers-pawn'));
    expect(pawn).not.toBeNull();
    expect(pawn.componentInstance.getTint()).toBe('#wave-blue');
  });

  it('isSelected should have bigger priority than isAvailableToMove', async () => {
    expect(fixture).toBeTruthy();
    fixture.componentInstance.isSelected = true;
    fixture.componentInstance.isAvailableToMove = true;
    await fixture.detectChanges();
    const pawn = fixture.debugElement.query(By.css('web-checkers-pawn'));
    expect(pawn).not.toBeNull();
    expect(pawn.componentInstance.getTint()).toBe('#wave-blue');
  });

  it('should have green tint when available to move', async () => {
    expect(fixture).toBeTruthy();
    fixture.componentInstance.isAvailableToMove = true;
    await fixture.detectChanges();
    const pawn = fixture.debugElement.query(By.css('web-checkers-pawn'));
    expect(pawn).not.toBeNull();
    expect(pawn.componentInstance.getTint()).toBe('#wave-green');
  });

});
