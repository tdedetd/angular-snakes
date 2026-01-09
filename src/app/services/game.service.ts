import { Injectable } from '@angular/core';
import { Game } from '../game/game';
import { GameConfig } from '../game/models/game-config.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _game = new BehaviorSubject<Game | null>(null);
  private intervalId: number | null = null;

  public playersState = toSignal(
    this._game.pipe(switchMap(
      (game) => game ? game.getPlayersStateChangeObservable() : of(undefined)
    ))
  );

  public tick = toSignal(
    this._game.pipe(switchMap(
      (game) => game ? game.getTickObservable() : of(undefined)
    ))
  );

  public game = toSignal(this._game, { initialValue: null });

  public newGame(config: GameConfig): void {
    const game = new Game(config);
    this._game.next(game);

    this.stop();
    this.start();
  }

  public start(): void {
    const game = this._game.getValue();

    if (game) {
      this.intervalId = setInterval(() => {
        game.tick();

        if (game.isGameover) {
          this.stop();
        }
      }, 100, null);
    }
  }

  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }
}
