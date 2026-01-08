import { GameConfig } from './models/game-config.model';
import { Player } from './models/player.model';

export class Game {
  public readonly width: number;
  public readonly height: number;
  // public readonly players: Player[];

  constructor(width: number, height: number, config: GameConfig) {
    this.width = width;
    this.height = height;

  }
}
