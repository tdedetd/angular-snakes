import { Directions } from './enums/directions.enum';
import { Point } from './models/point.model';

const headMoveMapper: Record<Directions, (coord: Point) => Point> = {
  [Directions.Up]: (head) => ({ x: head.x, y: head.y - 1 }),
  [Directions.Down]: (head) => ({ x: head.x, y: head.y + 1 }),
  [Directions.Left]: (head) => ({ x: head.x - 1, y: head.y }),
  [Directions.Right]: (head) => ({ x: head.x + 1, y: head.y }),
};

export class Snake {
  public get head(): Point {
    return this.parts[0];
  }

  public get direction(): Directions {
    return this._direction;
  }

  constructor(
    public readonly parts: Point[],
    public readonly color: string,
    private _direction: Directions,
  ) {
    if (parts.length === 0) {
      throw new Error('parts length is 0');
    }
  }

  public move(): void {
    for (let i = this.parts.length - 1; i > 0; i--) {
      this.parts[i] = this.parts[i - 1];
    }

    this.parts[0] = headMoveMapper[this._direction](this.head);
  }

  public grow(): void {
    const tail = this.parts[this.parts.length - 1];
    this.parts.push(tail);
  }

  public turn(direction: Directions): void {
    if (!(
      this._direction === Directions.Up && direction === Directions.Down ||
      this._direction === Directions.Down && direction === Directions.Up ||
      this._direction === Directions.Left && direction === Directions.Right ||
      this._direction === Directions.Right && direction === Directions.Left
    )) {
      this._direction = direction;
    }
  }
}
