import { BehaviorSubject, Observable } from 'rxjs';
import { randomInterval } from '../utils/random-interval';
import { GameConfig } from './models/game-config.model';
import { Player } from './models/player.model';
import { Point } from './models/point.model';
import { generatePlayers } from './utils/functions/generate-players';
import { isSamePoint } from './utils/functions/is-same-point';
import { PlayerDisplayInfo } from './models/player-display-info.model';
import { toPlayersDisplayInfo } from './utils/functions/to-players-display-info';
import { removeElementFromArray } from '../utils/remove-element-from-array';
import { Snake } from './snake';

export class Game {
  public readonly width: number;
  public readonly height: number;

  private readonly players: Player[];
  private _apples: Point[] = [];
  private notAiPlayerIndex: number;

  private playersStateChangeEvent: BehaviorSubject<PlayerDisplayInfo[]>;

  public get apples(): Point[] {
    return this._apples;
  }

  public get isGameover(): boolean {
    return this.players.every(({ isOut }) => isOut);
  }

  public get remainingPlayers(): Player[] {
    return this.players.filter(({ isOut }) => !isOut);
  }

  public get aiPlayers(): Player[] {
    return this.players.filter((_, i) => i !== this.notAiPlayerIndex);
  }

  constructor(config: GameConfig) {
    this.width = config.width;
    this.height = config.height;

    this.players = generatePlayers(config.players, config.width, config.height);
    this.playersStateChangeEvent = new BehaviorSubject(toPlayersDisplayInfo(this.players));

    for (let i = 0; i < (config.applesCount ?? 1); i++) {
      const apple = this.generateApple();
      this._apples.push(apple);
    }

    this.notAiPlayerIndex = config.players.findIndex(({ notAi }) => notAi);
  }

  public tick(): void {
    let appleHasBeenEaten = false;
    let hasCollision = false;

    const playersToOut: Player[] = [];

    this.remainingPlayers.forEach((player) => {
      const snake = player.snake;
      snake.move();

      this.apples.forEach((apple) => {
        appleHasBeenEaten = this.handleAppleCollision(player, apple) || appleHasBeenEaten;
      });

      const isCurrentPlayerCollides = this.checkSnakeCollision(player.snake);
      if (isCurrentPlayerCollides) {
        playersToOut.push(player);
      }
      hasCollision = isCurrentPlayerCollides || hasCollision;
    });

    playersToOut.forEach((player) => {
      player.isOut = true;
    });

    if (appleHasBeenEaten || hasCollision) {
      this.playersStateChangeEvent.next(toPlayersDisplayInfo(this.players));
    }
  }

  public getPlayersStateChangeObservable(): Observable<PlayerDisplayInfo[]> {
    return this.playersStateChangeEvent.asObservable();
  }

  public isCellFree(point: Point, considerApples: boolean): boolean {
    if (considerApples && this.apples.some((apple) => isSamePoint(point, apple))) {
      return false;
    }

    if (this.isPointOutside(point)) {
      return false;
    }

    return !this.remainingPlayers
      .map(({ snake }) => snake)
      .some((snake) => snake.parts.some((part) => isSamePoint(point, part)));
  }

  public isPointOutside(point: Point): boolean {
    return (
      point.x < 0 ||
      point.x >= this.width ||
      point.y < 0 ||
      point.y >= this.height
    );
  }

  private handleAppleCollision(player: Player, apple: Point): boolean {
    const snake = player.snake;

    if (isSamePoint(snake.head, apple)) {
      player.points++;
      snake.grow();
      this.replaceApple(apple);
      return true;
    }

    return false;
  }

  private checkSnakeCollision(snake: Snake): boolean {
    const head = snake.head;
    const collisions = this.remainingPlayers.flatMap(
      (player) => player.snake.parts.filter((part) => isSamePoint(part, head))
    );
    const hasCollision = (
      removeElementFromArray(collisions, head).length > 0 ||
      this.isPointOutside(head)
    );

    return hasCollision;
  }

  private replaceApple(apple: Point): void {
    const index = this.apples.indexOf(apple);
    if (index !== -1) {
      this.apples[index] = this.generateApple();
    }
  }

  private generateApple(): Point {
    let newApple: Point | null = null;
    while (!newApple || !this.isCellFree(newApple, true)) {
      newApple = {
        x: Math.floor(randomInterval(0, this.width)),
        y: Math.floor(randomInterval(0, this.height)),
      };
    }
    return newApple;
  }
}
