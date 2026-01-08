import { Snake } from '../snake';

export interface Player {
  snake: Snake;
  name: number;
  points: number;
  isOut: boolean;
}
