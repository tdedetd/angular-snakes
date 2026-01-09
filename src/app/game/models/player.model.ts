import { Snake } from '../snake';

export interface Player {
  id: string;
  snake: Snake;
  name: string;
  points: number;
  isOut: boolean;
}
