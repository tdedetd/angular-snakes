import { PlayerConfig } from './player-config.model';

export interface GameConfig {
  width: number;
  height: number;
  players: PlayerConfig[];
  applesCount?: number;
}
