import { Pawn } from './pawn';

describe('Pawn', () => {
  it('should create an instance', () => {
    expect(new Pawn()).toBeTruthy();
  });
  it('should have default property color = white', () => {
    const pawn = new Pawn();
    expect(pawn.color).toBe('white');
  });
});
