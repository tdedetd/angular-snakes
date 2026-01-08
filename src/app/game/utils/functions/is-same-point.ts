import { Point } from '../../models/point.model';

export function isSamePoint(point1: Point, point2: Point): boolean {
  return point1[0] === point2[0] && point1[1] === point2[1];
}
