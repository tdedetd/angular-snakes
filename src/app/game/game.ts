import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { randomInterval } from '../utils/random-interval';
import { GameConfig } from './models/game-config.model';
import { Player } from './models/player.model';
import { Point } from './models/point.model';
import { generatePlayers } from './utils/functions/generate-players';
import { isSamePoint } from './utils/functions/is-same-point';
import { PlayerDisplayInfo } from './models/player-display-info.model';
import { toPlayersDisplayInfo } from './utils/functions/to-players-display-info';
import { removeElementFromArray } from '../utils/remove-element-from-array';

export class Game {
  public readonly width: number;
  public readonly height: number;

  private readonly players: Player[];
  private _apples: Point[] = [];
  private notAiPlayerIndex: number;
  private moves = 0;

  private tickEvent = new Subject<number>();
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

  constructor(config: GameConfig) {
    this.width = config.width;
    this.height = config.height;

    this.players = generatePlayers(config.players, config.width, config.height);
    this.playersStateChangeEvent = new BehaviorSubject(toPlayersDisplayInfo(this.players));

    this._apples = Array(config.applesCount ?? 1).fill(this.generateApple());

    this.notAiPlayerIndex = config.players.findIndex(({ notAi }) => notAi);

    this.tickEvent.next(this.moves);
  }

  public tick(): void {
    let appleHasBeenEaten = false;
    let hasCollisionWithSnakes = false;

    this.remainingPlayers.forEach((player) => {
      const snake = player.snake;
      snake.move();

      this.apples.forEach((apple) => {
        appleHasBeenEaten = this.handleAppleCollision(player, apple) || appleHasBeenEaten;
      });

      hasCollisionWithSnakes = this.handleCollision(player) || hasCollisionWithSnakes;
    });

    if (appleHasBeenEaten || hasCollisionWithSnakes) {
      this.playersStateChangeEvent.next(toPlayersDisplayInfo(this.players));
    }

    this.moves++;
    this.tickEvent.next(this.moves);
  }

  public getTickObservable(): Observable<number> {
    return this.tickEvent.asObservable();
  }

  public getPlayersStateChangeObservable(): Observable<PlayerDisplayInfo[]> {
    return this.playersStateChangeEvent.asObservable();
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

  private handleCollision(player: Player): boolean {
    const head = player.snake.head;
    const collisions = this.remainingPlayers.flatMap(
      (player) => player.snake.parts.filter((part) => isSamePoint(part, head))
    );
    const hasCollision = (
      removeElementFromArray(collisions, head).length > 0 ||
      head.x < 0 ||
      head.x >= this.width ||
      head.y < 0 ||
      head.y >= this.height
    );

    if (hasCollision) {
      player.isOut = true;
    }

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
    while (!newApple || !this.isCellFree(newApple)) {
      newApple = {
        x: Math.floor(randomInterval(0, this.width)),
        y: Math.floor(randomInterval(0, this.height)),
      };
    }
    return newApple;
  }

  private isCellFree(point: Point): boolean {
    if (this.apples.some((apple) => isSamePoint(point, apple))) {
      return false;
    }

    return !this.remainingPlayers
      .map(({ snake }) => snake)
      .some((snake) => snake.parts.some((part) => isSamePoint(point, part)));
  }
}
