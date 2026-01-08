import { GameConfig } from './models/game-config.model';
import { Player } from './models/player.model';
import { Point } from './models/point.model';
import { generatePlayers } from './utils/functions/generate-players';
import { isSamePoint } from './utils/functions/is-same-point';

export class Game {
  public readonly width: number;
  public readonly height: number;
  public readonly players: Player[];

  private _apples: Point[] = [];

  public get apples(): Point[] {
    return this._apples;
  }

  constructor(width: number, height: number, config: GameConfig) {
    this.width = width;
    this.height = height;
    this.players = generatePlayers(config.players);
  }

  public tick(): void {
    this.players.forEach((player) => {
      const snake = player.snake;
      snake.move();

      this.apples.forEach((apple) => {
        this.checkAppleCollision(player, apple);
      });
    });
  }

  private checkAppleCollision(player: Player, apple: Point): void {
    const snake = player.snake;
    if (isSamePoint(snake.head, apple)) {
      player.points++;
      snake.grow();
    }
  }
}
