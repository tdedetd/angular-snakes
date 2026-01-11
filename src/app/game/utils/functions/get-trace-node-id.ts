import { TraceNodeId } from '../../models/trace-node-id.model';

export function getTraceNodeId(x: number, y: number): TraceNodeId {
  return `${x},${y}`;
}
