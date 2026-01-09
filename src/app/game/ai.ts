import { getDistance } from '../utils/get-distance';
import { Game } from './game';
import { Player } from './models/player.model';
import { Point } from './models/point.model';
import { TraceNodeId } from './models/trace-node-id.model';
import { getTraceNodeId } from './utils/functions/get-trace-node-id';
import { isSamePoint } from './utils/functions/is-same-point';

interface TraceNodeInfo {
  point: Point;
  nodeId: TraceNodeId;
  totalValue: number;
}

interface TraceInfo {
  checkedNodes: TraceNodeId[];
  apple: Point;
  solutionHasFound: boolean;
}

export class Ai {
  constructor(private game: Game, private player: Player) {}

  public handleControl(): void {
    if (this.player.isOut) {
      return;
    }

    const path = this.getPath();
  }

  public getPath(): Point[] | null {
    const head = this.player.snake.head;

    const pathes = this.game.apples.map((apple) => {
      const checkedNodes = this.getCheckedNodes();
      return this.tracePath(head, 0, {
        apple,
        checkedNodes,
        solutionHasFound: false,
      });
    }).filter((path) => path !== null);
    return pathes.sort((a, b) => a.length - b.length)[0] ?? null;
  }

  private tracePath(point: Point, value: number, traceInfo: TraceInfo): Point[] | null {
    if (traceInfo.solutionHasFound) {
      return null;
    }

    const pointsToCheck = ([
      { x: point.x - 1, y: point.y },
      { x: point.x + 1, y: point.y },
      { x: point.x, y: point.y - 1 },
      { x: point.x, y: point.y + 1 },
    ] as Point[])
      .map((point): [Point, TraceNodeId] => [point, getTraceNodeId(point)])
      .filter((record) => !traceInfo.checkedNodes.includes(record[1]))
      .map((record): TraceNodeInfo => ({
        point: record[0],
        nodeId: record[1],
        totalValue: value + getDistance(record[0], traceInfo.apple),
      }))
      .sort((a, b) => a.totalValue - b.totalValue);
    
    traceInfo.checkedNodes.push(...pointsToCheck.map(({ nodeId }) => nodeId));

    if (!pointsToCheck.length) {
      return null;
    }

    const solutions = pointsToCheck.map((pointToCheck) => {
      if (isSamePoint(pointToCheck.point, traceInfo.apple)) {
        traceInfo.solutionHasFound = true;
        return [point];
      } else {
        const remainingPath = this.tracePath(point, value + 1, traceInfo);
        return remainingPath ? [point, ...remainingPath] : null;
      }
    }).filter((solution) => solution !== null);
    return solutions.sort((a, b) => a.length - b.length)[0];
  }

  private getCheckedNodes(): TraceNodeId[] {
    return this.game.remainingPlayers.flatMap(({ snake }) => snake.parts.map((part) => getTraceNodeId(part)));
  }
}
