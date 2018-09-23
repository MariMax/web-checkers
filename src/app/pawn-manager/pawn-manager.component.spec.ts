import { Pawn } from './../data-structures/pawn/pawn';
import { GameManagerService } from './../services/game-manager/game-manager.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PawnManagerComponent } from './pawn-manager.component';
import { PawnComponentMock } from '../pawn/pawn.component.spec';
import { By } from '@angular/platform-browser';
import { PawnTypes } from '../services/game-manager/pawn-types.enum';

@Component({
  selector: 'web-checkers-pawn-manager',
  template: '<!-- empty -->',
})
export class PawnManagerComponentMock extends PawnManagerComponent {
}

@Component({
  template: '<web-checkers-pawn-manager [size]="size"></web-checkers-pawn-manager>',
})
class HostComponent {
  public size = '200px';
}

describe('PawnManagerComponent', () => {
  let component: PawnManagerComponent;
  let fixture: ComponentFixture<PawnManagerComponent>;
  let gameManager: GameManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PawnManagerComponent, PawnComponentMock, HostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    gameManager = TestBed.get(GameManagerService);
    fixture = TestBed.createComponent(PawnManagerComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => fixture.destroy());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should get pawns locations from gameManager and generate them based on types', () => {
    const getLocationsSpy = spyOn(gameManager, 'getPawnLocations').and.returnValue([
      {x: 1, y: 0},
      {x: 0, y: 7},
      {x: 3, y: 1}
    ]);
    const getPawnTypeSpy = spyOn(gameManager, 'getPawnTypeAtLocation').and.callFake((x, y) => {
      switch (x) {
        case 1: return PawnTypes.PL1_PAWN;
        case 0: return PawnTypes.PL2_PAWN;
        default: return PawnTypes.NONE;
      }
    });
    fixture.detectChanges();
    expect(component.pawns.length).toBe(2);
    let blackCount = 0;
    let whiteCount = 0;
    component.pawns.forEach(i => {
      if (i.color === 'black') return blackCount++;
      whiteCount++;
    });
    expect(blackCount).toBe(1);
    expect(whiteCount).toBe(1);
  });

  it('should have default size 100px', () => {
    expect(component.size).toBe('100px');
  });

  it('should accept size from parent component', async () => {
    const f = TestBed.createComponent(HostComponent);
    await f.detectChanges();
    const pawnManagerComponent = f.debugElement.query(By.css('web-checkers-pawn-manager'));
    expect(pawnManagerComponent).not.toBeNull();
    expect(pawnManagerComponent.componentInstance.size).toBe(f.componentInstance.size);
  });

  it('should adjust pawn sizes on change size input', async () => {
    const f = TestBed.createComponent(HostComponent);
    await f.detectChanges();
    f.componentInstance.size = '100px';
    const pawnManagerComponent = f.debugElement.query(By.css('web-checkers-pawn-manager'));
    pawnManagerComponent.componentInstance.pawns = [new Pawn()];
    const adjustSpy = spyOn((pawnManagerComponent.componentInstance as any), 'adjustPawnPosition');
    await f.detectChanges();
    expect(adjustSpy).toHaveBeenCalled();
  })
});
