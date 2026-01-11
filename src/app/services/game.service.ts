import { inject, Injectable } from '@angular/core';
import { Game } from '../game/game';
import { GameConfig } from '../game/models/game-config.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, of, Subject, switchMap } from 'rxjs';
import { Ai } from '../game/ai';
import { IsBrowserToken } from '../tokens/is-browser.token';

interface AiDebugInfo {
  games: number;
  deadEnds: number;
  deadEndOuts: number;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _gameConfig: GameConfig | null = null;
  private _game = new BehaviorSubject<Game | null>(null);
  private _tick = new Subject<void>();
  private intervalId: number | null = null;
  private _ais: Ai[] = [];

  private aisDebugInfo: AiDebugInfo = {
    games: 0,
    deadEnds: 0,
    deadEndOuts: 0,
  };

  private isBrowser = inject(IsBrowserToken);

  public playersState = toSignal(
    this._game.pipe(switchMap(
      (game) => game ? game.getPlayersStateChangeObservable() : of([])
    )),
    { initialValue: [] },
  );

  public game = toSignal(this._game, { initialValue: null });

  public get ais(): Ai[] {
    return this._ais;
  }

  public newGame(config: GameConfig, autoRestart = false): void {
    this._gameConfig = config;
    if (!this.isBrowser) {
      return;
    }

    const game = new Game(this._gameConfig);
    this._ais = game.aiPlayers.map((player) => new Ai(game, player));
    this._game.next(game);

    this.stop();
    this.start(autoRestart);
  }

  public start(autoRestart: boolean): void {
    if (!this.isBrowser) {
      return;
    }

    const game = this._game.getValue();

    if (game) {
      this.intervalId = setInterval(() => {
        this._ais.forEach((ai) => {
          ai.handleControl();
        });
        game.tick();
        this._tick.next();

        if (game.isGameover) {
          this.stop();
          this.displayAisDebugInfo(this._ais);
          if (autoRestart && this._gameConfig) {
            this.newGame(this._gameConfig, autoRestart);
          }
        }
      }, 100, null);
    }
  }

  public stop(): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  public getTickObservable(): Observable<void> {
    return this._tick.asObservable();
  }

  private displayAisDebugInfo(ais: Ai[]): void {
    const aisDebugInfoLastGame = ais.reduce((acc, ai) => {
      return {
        ...acc,
        deadEnds: acc.deadEnds + ai.debugInfo.deadEnds,
        deadEndOuts: acc.deadEndOuts + ai.debugInfo.deadEndOuts,
      };
    }, { deadEnds: 0, deadEndOuts: 0 });

    this.aisDebugInfo = {
      games: this.aisDebugInfo.games + 1,
      deadEnds: this.aisDebugInfo.deadEnds + aisDebugInfoLastGame.deadEnds,
      deadEndOuts: this.aisDebugInfo.deadEndOuts + aisDebugInfoLastGame.deadEndOuts,
    };
    console.debug(JSON.stringify(this.aisDebugInfo));

    const persents = this.aisDebugInfo.deadEnds > 0
      ? this.aisDebugInfo.deadEndOuts / this.aisDebugInfo.deadEnds * 100
      : 0;
    console.debug(`${persents.toFixed(2)}%`);
  }
}
