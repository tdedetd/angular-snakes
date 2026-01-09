import { Point } from '../../models/point.model';
import { TraceNodeId } from '../../models/trace-node-id.model';

export function getTraceNodeId({ x, y }: Point): TraceNodeId {
  return `${x},${y}`;
}
