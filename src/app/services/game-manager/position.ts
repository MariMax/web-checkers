export class Position {
  constructor(public x: number, public y: number) {}

  isEqual(p: Position) {
    return p.x === this.x && p.y === this.y;
  }
}
