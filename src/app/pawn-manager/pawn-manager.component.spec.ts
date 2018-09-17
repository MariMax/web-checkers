import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PawnManagerComponent } from './pawn-manager.component';
import { PawnComponentMock } from '../pawn/pawn.component.spec';
import { By } from '@angular/platform-browser';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PawnManagerComponent, PawnComponentMock, HostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PawnManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should generate 12 black pawns', () => {
    expect(component.blackItems.length).toBe(12);
    expect(component.blackItems.every( i => i.color === 'black')).toBe(true);
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
  })
});
