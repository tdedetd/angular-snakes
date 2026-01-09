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

  constructor(
    public readonly parts: Point[],
    public readonly color: string,
    private direction: Directions,
  ) {
    if (parts.length === 0) {
      throw new Error('parts length is 0');
    }
  }

  public move(): void {
    for (let i = this.parts.length - 1; i > 0; i--) {
      this.parts[i] = this.parts[i - 1];
    }

    this.parts[0] = headMoveMapper[this.direction](this.head);
  }

  public grow(): void {
    const tail = this.parts[this.parts.length - 1];
    this.parts.push(tail);
  }

  public turn(direction: Directions): void {
    if (!(
      this.direction === Directions.Up && direction === Directions.Down ||
      this.direction === Directions.Down && direction === Directions.Up ||
      this.direction === Directions.Left && direction === Directions.Right ||
      this.direction === Directions.Right && direction === Directions.Left
    )) {
      this.direction = direction;
    }
  }
}
