import { Injectable } from '@angular/core';
import { Game } from '../game/game';
import { GameConfig } from '../game/models/game-config.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, Subject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _game = new Subject<Game | null>();
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

  public start(config: GameConfig): void {
    const game = new Game(config);
    this._game.next(game);

    this.intervalId = setInterval(() => {
      game.tick();

      if (game.isGameover) {
        this.stop();
      }
    }, 100, null);
  }

  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }
}
