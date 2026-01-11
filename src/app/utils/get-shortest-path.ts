import { Point } from '../game/models/point.model';
import { TraceNodeId } from '../game/models/trace-node-id.model';
import { getTraceNodeId } from '../game/utils/functions/get-trace-node-id';
import { isSamePoint } from '../game/utils/functions/is-same-point';
import { getDistanceCells } from './get-distance-cells';
import { isPointOutside } from './is-point-outside';

interface TraceOptions {
  checkedNodes: TraceNodeId[];
  target: Point;
  solutionFound: boolean;
  width: number;
  height: number;
}

interface TraceNodeInfo {
  point: Point;
  nodeId: TraceNodeId;
  totalValue: number;
}

export function getShortestPath(start: Point, traceOptions: TraceOptions, value = 0): Point[] | null {
  if (traceOptions.solutionFound) {
    return null;
  }

  const pointsToCheck = ([
    { x: start.x - 1, y: start.y },
    { x: start.x + 1, y: start.y },
    { x: start.x, y: start.y - 1 },
    { x: start.x, y: start.y + 1 },
  ] as Point[])
    .map((point): [Point, TraceNodeId] => [point, getTraceNodeId(point.x, point.y)])
    .filter(
      (record) => !traceOptions.checkedNodes.includes(record[1]) &&
        !isPointOutside(record[0].x, record[0].y, traceOptions.width, traceOptions.height)
    )
    .map((record): TraceNodeInfo => ({
      point: record[0],
      nodeId: record[1],
      totalValue: value + getDistanceCells(record[0], traceOptions.target),
    }))
    .sort((a, b) => a.totalValue - b.totalValue);
  
  traceOptions.checkedNodes.push(...pointsToCheck.map(({ nodeId }) => nodeId));

  if (!pointsToCheck.length) {
    return null;
  }

  const solutions = pointsToCheck.map((pointToCheck) => {
    if (isSamePoint(pointToCheck.point, traceOptions.target)) {
      traceOptions.solutionFound = true;
      return [pointToCheck.point];
    } else {
      const remainingPath = getShortestPath(pointToCheck.point, traceOptions, value + 1);
      return remainingPath ? [pointToCheck.point, ...remainingPath] : null;
    }
  }).filter((solution) => solution !== null);
  return solutions.length ? solutions.sort((a, b) => a.length - b.length)[0] : null;
};
