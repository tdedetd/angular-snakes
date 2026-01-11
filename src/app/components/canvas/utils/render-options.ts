import { Point } from '../../../game/models/point.model';

export class RenderOptions {
  public readonly halfCellLength: number;

  constructor(
    public readonly cellLength: number,
    public readonly startPoint: Point,
  ) {
    this.halfCellLength = cellLength / 2;
  }
}
