import { Game } from '../../../game/game';
import { Point } from '../../../game/models/point.model';

export class RenderOptions {
  public readonly halfCellLength: number;
  public readonly fieldWidthPx: number;
  public readonly fieldHeigthPx: number;

  constructor(
    game: Game,
    public readonly cellLength: number,
    public readonly startPoint: Point,
  ) {
    this.halfCellLength = cellLength / 2;
    this.fieldWidthPx = cellLength * game.width;
    this.fieldHeigthPx = cellLength * game.height;
  }
}
