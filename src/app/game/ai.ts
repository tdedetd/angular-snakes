import { getShortestPath } from '../utils/get-shortest-path';
import { Directions } from './enums/directions.enum';
import { Game } from './game';
import { Player } from './models/player.model';
import { Point } from './models/point.model';
import { TraceNodeId } from './models/trace-node-id.model';
import { getTraceNodeId } from './utils/functions/get-trace-node-id';
import { isSamePoint } from './utils/functions/is-same-point';

export class Ai {
  public readonly debugInfo = {
    deadEnds: 0,
    deadEndOuts: 0,
  };

  private isDeadEnd = false;
  private readonly checkPointsOrder: 'xFirst' | 'yFirst' = Math.random() >= 0.5 ? 'xFirst' : 'yFirst';

  public get color(): string {
    return this.player.snake.color;
  }

  public get isOut(): boolean {
    return this.player.isOut;
  }

  public get points(): number {
    return this.player.points;
  }

  constructor(private game: Game, private player: Player) {}

  public handleControl(): void {
    if (this.player.isOut) {
      return;
    }

    const path = this.getPath();
    if (path && path[0]) {
      if (this.isDeadEnd) {
        this.debugInfo.deadEndOuts++;
      }

      const targetPoint = path[0];
      const snake = this.player.snake;
      const head = snake.head;
      if (isSamePoint(targetPoint, { x: head.x - 1, y: head.y })) {
        snake.turn(Directions.Left);
      } else if (isSamePoint(targetPoint, { x: head.x + 1, y: head.y })) {
        snake.turn(Directions.Right);
      } else if (isSamePoint(targetPoint, { x: head.x, y: head.y - 1 })) {
        snake.turn(Directions.Up);
      } else if (isSamePoint(targetPoint, { x: head.x, y: head.y + 1 })) {
        snake.turn(Directions.Down);
      }

      this.isDeadEnd = false;
    } else {
      if (!this.isDeadEnd) {
        this.debugInfo.deadEnds++;
        console.info(`%cdead end "${this.player.name}"`, `color: ${this.color}`);
      }
      this.isDeadEnd = true;
    }
  }

  public getPath(): Point[] | null {
    const head = this.player.snake.head;

    const paths = this.game.apples.map((apple) => {
      const checkedNodes = this.getCheckedNodes();
      return getShortestPath(head, {
        target: apple,
        checkedNodes,
        solutionFound: false,
        width: this.game.width,
        height: this.game.height,
        pointsCheckOrder: this.checkPointsOrder,
      });
    }).filter((path) => path !== null);
    return paths.sort((a, b) => a.length - b.length)[0] ?? null;
  }

  private getCheckedNodes(): TraceNodeId[] {
    return this.game.remainingPlayers.flatMap(({ snake }) => snake.parts.map(({ x, y }) => getTraceNodeId(x, y)));
  }
}
