import { Pawn } from './pawn';

class PawnExtention extends Pawn {
  constructor() {
    super();
  }
}

describe('Pawn', () => {
  it('should create an instance', () => {
    expect(new PawnExtention()).toBeTruthy();
  });
});
