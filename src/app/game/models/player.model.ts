import { Snake } from '../snake';

export interface Player {
  snake: Snake;
  name: string;
  points: number;
  isOut: boolean;
}
