import { Component, OnInit, Renderer2, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Pawn } from '../data-structures/pawn/pawn';

@Component({
  selector: 'web-checkers-pawn',
  templateUrl: './pawn.component.html',
  styleUrls: ['./pawn.component.css']
})
export class PawnComponent extends Pawn implements AfterViewInit {
  @Input() selected = false;
  @Input() size = '100px';

  @ViewChild('pawn') pawn: ElementRef<HTMLDivElement>;
  constructor(private renderer: Renderer2) {
    super();
   }

   ngAfterViewInit() {
     this.renderer.setProperty(this.pawn.nativeElement, 'style', `--size: ${this.size}; --left: ${this.left}; --top: ${this.top}`);
   }
}
