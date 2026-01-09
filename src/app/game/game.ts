import { randomInterval } from '../utils/random-interval';
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

  public get isGameover(): boolean {
    return this.players.every(({ isOut }) => isOut);
  }

  constructor(width: number, height: number, config: GameConfig) {
    this.width = width;
    this.height = height;
    this.players = generatePlayers(config.players, width, height);

    const applesCount = config.applesCount ?? 1;
    this._apples = Array(applesCount).fill(this.generateApple());
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
      this.replaceApple(apple);
    }
  }

  private replaceApple(apple: Point): void {
    const index = this.apples.indexOf(apple);
    if (index !== -1) {
      this.apples[index] = this.generateApple();
    }
  }

  private generateApple(): Point {
    let newApple: Point | null = null;
    while (!newApple || !this.isCellFree(newApple)) {
      newApple = {
        x: randomInterval(0, this.width),
        y: randomInterval(0, this.height),
      };
    }
    return newApple;
  }

  private isCellFree(point: Point): boolean {
    if (this.apples.some((apple) => isSamePoint(point, apple))) {
      return false;
    }

    return !this.players
      .filter(({ isOut }) => !isOut)
      .map(({ snake }) => snake)
      .some((snake) => snake.parts.some((part) => isSamePoint(point, part)));
  }
}
