import { PawnComponentBase } from './../data-structures/pawn-component-base/pawn-component.base';
import { GameManagerService } from './../services/game-manager/game-manager.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PawnManagerComponent } from './pawn-manager.component';
import { PawnComponentMock } from '../pawn/pawn.component.spec';
import { By } from '@angular/platform-browser';
import { PawnTypes } from '../services/game-manager/pawn-types.enum';
import { PlayerType } from '../services/game-manager/active-player.enum';

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
    const getPawnTypeSpy = spyOn(gameManager, 'getPawnModelAtLocation').and.callFake((x, y) => {
      switch (x) {
        case 1: {
          const pawn = new PawnComponentBase();
          pawn.owner = PlayerType.PLAYER1;
          pawn.color = 'white';
          return pawn;
        }
        case 0: {
          const pawn = new PawnComponentBase();
          pawn.owner = PlayerType.PLAYER2;
          pawn.color = 'black';
          return pawn;
        }
        default: return null;
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
    pawnManagerComponent.componentInstance.pawns = [new PawnComponentBase()];
    const adjustSpy = spyOn((pawnManagerComponent.componentInstance as any), 'adjustPawnPosition');
    await f.detectChanges();
    expect(adjustSpy).toHaveBeenCalled();
  });

  describe('onClick should get cell coordinates and select a pawn if possible', () => {
    let fixt: ComponentFixture<HostComponent>;
    let pawnManagerComponent;
    beforeEach(() => {
      fixt = TestBed.createComponent(HostComponent);
      fixt.componentInstance.size = '100px';
      fixt.detectChanges();

      pawnManagerComponent = fixt.debugElement.query(By.css('web-checkers-pawn-manager'));
    });
    it('should get click coordinates and ask gameManager if there is a pawn', async () => {
      const getPawnTypeSpy = spyOn(gameManager, 'getPawnModelAtLocation');
      pawnManagerComponent.triggerEventHandler('click', {
        offsetX: 150,
        offsetY: 50
      });
      expect(getPawnTypeSpy).toHaveBeenCalledWith(1, 0);
    });

    it('if there is no pawn selectedPawn should be null', async () => {
      spyOn(gameManager, 'getPawnModelAtLocation').and.returnValue(null);
      const isSelectionAllowed = spyOn(gameManager, 'isSelectionAllowed');
      pawnManagerComponent.triggerEventHandler('click', {});
      expect(isSelectionAllowed).not.toHaveBeenCalled();
      expect((pawnManagerComponent.componentInstance as any).selectedPawn).toBeNull();
    });

    it('if selection is not allowed selectedPawn should be null', async () => {
      spyOn(gameManager, 'getPawnModelAtLocation').and.returnValue(null);
      const isSelectionAllowed = spyOn(gameManager, 'isSelectionAllowed');
      pawnManagerComponent.triggerEventHandler('click', {});
      expect(isSelectionAllowed).not.toHaveBeenCalled();
      expect((pawnManagerComponent.componentInstance as any).selectedPawn).toBeNull();
    });

    it('if there is a pawn should ask gameManager permission to select', async () => {
      const pawn = new PawnComponentBase();
      spyOn(gameManager, 'getPawnModelAtLocation').and.returnValue(pawn);
      const isSelectionAllowed = spyOn(gameManager, 'isSelectionAllowed').and.returnValue(true);
      pawnManagerComponent.triggerEventHandler('click', {});
      expect(isSelectionAllowed).toHaveBeenCalledWith(pawn);
    });

    it('if there is a pawn and permission to select should find it and select it', async () => {
      const pawn = new PawnComponentBase();
      pawn.type = PawnTypes.PAWN;
      pawn.owner = PlayerType.PLAYER1;
      pawn.currentCol = 0;
      pawn.currentRow = 7;

      spyOn(gameManager, 'getPawnModelAtLocation').and.returnValue(pawn);
      (pawnManagerComponent.componentInstance as any).pawns.push(pawn);
      const isSelectionAllowed = spyOn(gameManager, 'isSelectionAllowed').and.returnValue(true);
      pawnManagerComponent.triggerEventHandler('click', {
        offsetX: 50,
        offsetY: 750
      });
      expect((pawnManagerComponent.componentInstance as any).selectedPawn).toBe(pawn);
    });


  });

});
