import { Coord } from './models/coord.model';
import { Directions } from './enums/directions.enum';

const headMoveMapper: Record<Directions, (coord: Coord) => Coord> = {
  [Directions.Up]: (coord) => [coord[0], coord[1] - 1],
  [Directions.Down]: (coord) => [coord[0], coord[1] - 1],
  [Directions.Left]: (coord) => [coord[0] - 1, coord[1]],
  [Directions.Right]: (coord) => [coord[0] + 1, coord[1]],
};

export class Snake {
  public get head(): Coord {
    return this.parts[0];
  }

  constructor(
    public readonly parts: Coord[],
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
    // TODO: restrict opposite direction
    this.direction = direction;
  }
}
