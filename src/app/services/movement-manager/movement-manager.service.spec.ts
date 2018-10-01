import { PlayerType } from './../game-manager/active-player.enum';
import { GameManagerService } from './../game-manager/game-manager.service';
import { TestBed } from '@angular/core/testing';

import { MovementManagerService } from './movement-manager.service';
import { PawnModel } from '../../data-structures/pawn/pawn.model';
import { PawnTypes } from '../game-manager/pawn-types.enum';

describe('MovementManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MovementManagerService = TestBed.get(MovementManagerService);
    expect(service).toBeTruthy();
  });

  it('should subscribe on turn change', () => {
    const gameManager = TestBed.get(GameManagerService);
    const turnChangeSubscriptionSpy = spyOn(gameManager, 'subscribeOnTurnChange');
    const service: MovementManagerService = TestBed.get(MovementManagerService);
    const instance = service as any;
    expect(turnChangeSubscriptionSpy).toHaveBeenCalledWith(instance.onTurnChange);
  });

  it('onTurnChange should call findPawnsAvailableToMove', () => {
    const service: MovementManagerService = TestBed.get(MovementManagerService);
    const instance = service as any;
    spyOn(instance, 'findPawnsAvailableToMove');
    instance.onTurnChange();
    expect(instance.findPawnsAvailableToMove).toHaveBeenCalled();
  });

  it('findPawnsAvailableToMove should get all pawns of active Player and find available to move', () => {
    const gameManager = TestBed.get(GameManagerService);
    const getPawnLocationsSpy = spyOn(gameManager, 'getPawnLocations');
    const getPawnModelAtLocationSpy = spyOn(gameManager, 'getPawnModelAtLocation');
    const getMovementDirectionSpy = spyOn(gameManager, 'getMovementDirection');
    const isSelectionAllowedSpy = spyOn(gameManager, 'isSelectionAllowed');
    const locations = [{x: 0, y: 5},{x: 2, y: 5},{x: 4, y: 5},{x: 6, y: 5}];
    const pawns =       new Array(4)
    .fill(null)
    .map((x, index) => {
      const pawn = new PawnModel();
      pawn.owner = PlayerType.PLAYER1;
      pawn.currentRow = 5 + Math.floor(index / 4);
      pawn.currentCol = (index % 4) * 2 + 1 - (pawn.currentRow % 2);
      pawn.type = PawnTypes.PAWN;
      return pawn;
    });

    const service: MovementManagerService = TestBed.get(MovementManagerService);
    const instance = service as any;
    
    getPawnLocationsSpy.and.returnValue(locations);
    getPawnModelAtLocationSpy.and.returnValue(pawns);
    isSelectionAllowedSpy.and.returnValue(true);

    instance.findPawnsAvailableToMove();

    expect(getMovementDirectionSpy).toHaveBeenCalled();
  });
});
